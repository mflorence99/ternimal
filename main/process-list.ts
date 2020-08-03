import { Channels } from './common/channels';
import { ProcessDescriptor } from './common/process-list';
import { ProcessList } from './common/process-list';

import * as electron from 'electron';
import * as os from 'os';
import * as process from 'process';

const pidUsage = require('pidusage');
const psList = require('ps-list');

const { ipcMain } = electron;

ipcMain.on(Channels.processListKill, (event: any, pids: number[]) => {
  pids.forEach(pid => process.kill(pid, 'SIGTERM'));
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
ipcMain.on(Channels.processListRequest, async(event: any) => {
  const processes = await psList();
  const ps = processes
    .filter(item => item.cpu > 0);
  const statsByPID = await pidUsage(ps.map(item => item.pid));
  // NOTE: we need to zip ps+stats because psList's numbers
  // aren't supported for Windows, but pidusage's are
  const totalmem = os.totalmem();
  const userInfo = os.userInfo();
  const processList: ProcessList = ps
    .map(item => [item, statsByPID[item.pid]])
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
        uid: (item.uid === userInfo.uid) ? userInfo.username : 
          ((item.uid === 0) ? 'root' : String(item.uid))
      } as ProcessDescriptor;
    })
    // NOTE: filter again because ps's cpu number isn't valid on Windows
    .filter(item => item.cpu > 0);
  event.reply(Channels.processListResponse, processList);
});
