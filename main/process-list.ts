import { Channels } from './common';
import { ProcessDescriptor } from './common';
import { ProcessList } from './common';

import * as electron from 'electron';
import * as os from 'os';
import * as process from 'process';

const pidUsage = require('pidusage');
const psList = require('ps-list');

const { ipcMain } = electron;

export const processListKill = (_, pids: number[]): void => {
  pids.forEach((pid) => process.kill(pid, 'SIGTERM'));
};

export const processListRequest = async (): Promise<void> => {
  const processes = await psList();
  const ps = processes.filter((item) => item.cpu > 0);
  const statsByPID = await pidUsage(ps.map((item) => item.pid));
  // NOTE: we need to zip ps+stats because psList's numbers
  // aren't supported for Windows, but pidusage's are
  const totalmem = os.totalmem();
  const userInfo = os.userInfo();
  const processList: ProcessList = ps
    .map((item) => [item, statsByPID[item.pid]])
    .filter(([_, stat]) => !!stat)
    .map(([item, stat]) => {
      return {
        cmd: item.cmd,
        cpu: Math.max(item.cpu, stat.cpu),
        ctime: stat.ctime,
        elapsed: stat.elapsed,
        memory: Math.max(item.memory, (stat.memory / totalmem) * 100),
        name: item.name,
        pid: item.pid,
        ppid: item.ppid,
        timestamp: stat.timestamp,
        uid:
          item.uid === userInfo.uid
            ? userInfo.username
            : item.uid === 0
            ? 'root'
            : String(item.uid)
      } as ProcessDescriptor;
    })
    // NOTE: filter again because ps's cpu number isn't valid on Windows
    .filter((item) => item.cpu > 0);
  // response is ready
  const theWindow = globalThis.theWindow;
  theWindow?.webContents.send(Channels.processListResponse, processList);
};

ipcMain.on(Channels.processListKill, processListKill);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
ipcMain.on(Channels.processListRequest, processListRequest);
