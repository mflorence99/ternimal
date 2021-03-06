import { Channels } from '../common';

import * as electron from 'electron';
import * as os from 'os';
import * as path from 'path';

const { app, ipcMain } = electron;

ipcMain.on(Channels.fsHomeDir, (event: Event): void => {
  event.returnValue = app.getPath('home') as any;
});

ipcMain.on(Channels.fsParentDir, (event: Event, nm: string): void => {
  event.returnValue = path.dirname(nm) as any;
});

ipcMain.on(Channels.fsParsePath, (event: Event, nm: string): void => {
  event.returnValue = path.parse(nm) as any;
});

ipcMain.on(Channels.fsPathSeparator, (event: Event): void => {
  event.returnValue = path.sep as any;
});

ipcMain.on(Channels.fsRootDir, (event: Event): void => {
  event.returnValue = (os.platform() === 'win32'
    ? process.cwd().split(path.sep)[0]
    : '/') as any;
});
