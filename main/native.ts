import { Channels } from './common';

import * as electron from 'electron';

import opener = require('opener');

const { clipboard, ipcMain } = electron;

ipcMain.on(Channels.nativeClipboardWrite, (_, text: string): void => {
  clipboard.writeText(text);
});

ipcMain.on(Channels.nativeOpen, (_, path: string): void => {
  opener(path);
});
