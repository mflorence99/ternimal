/* eslint-disable @typescript-eslint/naming-convention */
import { on } from '../common';

import Clipboard = require('./electron-clipboard');

const app = {
  getFileIcon: (file): Promise<string> => Promise.resolve(file),
  getPath: (nm): string => nm,
  on: jest.fn(on),
  quit: jest.fn()
};

class BrowserWindow {
  getBounds = jest.fn(() => ({ x: 1, y: 2, width: 3, height: 4 }));
  loadURL = jest.fn();
  on = jest.fn(on);
  setMenu = jest.fn();
  webContents = {
    openDevTools: jest.fn(),
    send: jest.fn(),
    reload: jest.fn()
  };

  constructor(public options: any) {}
}

const clipboard = new Clipboard();

const ipcMain = {
  on: jest.fn(on)
};

const electron = {
  app,
  BrowserWindow,
  clipboard,
  ipcMain
};

module.exports = electron;
