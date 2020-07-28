import { Channels } from './common/channels';
import { ProcessDescriptor } from './common/process-list';
import { ProcessList } from './common/process-list';

import * as electron from 'electron';
import * as osutils from 'os-utils';

const pidUsage = require('pidusage');
const psList = require('ps-list');

const { ipcMain } = electron;

// eslint-disable-next-line @typescript-eslint/no-misused-promises
ipcMain.on(Channels.processListRequest, async(event: any) => {
  const processes = await psList();
  const ps = processes
    .filter(item => item.cpu > 0);
  const statsByPID = await pidUsage(ps.map(item => item.pid));
  // NOTE: we need to zip ps+stats because psList's numbers
  // aren't supported for Windows, but pidusage's are
  const processList: ProcessList = ps
    .map(item => {
      const stat = statsByPID[item.pid];
      return {
        cmd: item.cmd,
        cpu: item.cpu || stat.cpu,
        ctime: stat.ctime,
        elapsed: stat.elapsed,
        memory: item.memory || (stat.memory / osutils.totalmem()),
        name: item.name,
        pid: item.pid,
        ppid: item.ppid,
        timestamp: stat.timestamp
      } as ProcessDescriptor;
    })
    // NOTE: filter again because ps's cpu number isn't valid on Windows
    .filter(item => item.cpu > 0);
  event.reply(Channels.processListResponse, processList);
});
