import { Channels } from './common';

import * as electron from 'electron';

const { ipcMain } = electron;

ipcMain.on(Channels.openDevTools, (): void => {
  const theWindow = globalThis.theWindow;
  theWindow?.webContents.openDevTools();
});

ipcMain.on(Channels.reload, (): void => {
  const theWindow = globalThis.theWindow;
  theWindow?.webContents.reload();
});
