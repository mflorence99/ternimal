import { Channels } from './common/channels';
import { SystemInfo } from './common/system-info';

import * as electron from 'electron';
import * as osutils from 'os-utils';

const { ipcMain } = electron;

const systemInfo: SystemInfo = {
  cpuUsage: 0,
  memUsage: 0
};

ipcMain.on(Channels.systemInfo, (event: Event): void => {
  osutils.cpuUsage((usage) => (systemInfo.cpuUsage = usage));
  systemInfo.memUsage = osutils.freemem() / osutils.totalmem();
  event.returnValue = systemInfo as any;
});
