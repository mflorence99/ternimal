import { Channels } from './common/channels';

import * as electron from 'electron';

const { ipcMain } = electron;

export let longRunningOpCancelID;

ipcMain.on(Channels.longRunningOpCancel, (_, id: string): void => {
  longRunningOpCancelID = id;
});
