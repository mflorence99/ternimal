import { Channels } from './common';

import * as electron from 'electron';

const { ipcMain } = electron;

let longRunningOpCancelID;

export const isLongRunningOpCanceled = (id: string, message: string): void => {
  if (longRunningOpCancelID === id) {
    longRunningOpCancelID = null;
    throw new Error(message);
  }
};

ipcMain.on(Channels.longRunningOpCancel, (_, id: string): void => {
  longRunningOpCancelID = id;
});
