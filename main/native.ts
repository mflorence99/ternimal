import { Channels } from './common';

import * as electron from 'electron';

import opener = require('opener');

const { app, clipboard, ipcMain } = electron;

ipcMain.on(Channels.nativeClipboardWrite, (_, text: string): void => {
  clipboard.writeText(text);
});

ipcMain.on(Channels.nativeDragStart, (event, file: string): void => {
  app.getFileIcon(file).then((icon) => {
    event.sender.startDrag({ file, icon });
  });
});

ipcMain.on(Channels.nativeOpen, (_, path: string): void => {
  opener(path);
});
