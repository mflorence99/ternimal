/* eslint-disable @typescript-eslint/naming-convention */
import Clipboard = require('./electron-clipboard');

const app = {
  getFileIcon: (file): Promise<string> => Promise.resolve(file),
  on: jest.fn((channel, cb) => (electron.callbacks[channel] = cb)),
  quit: jest.fn()
};

class BrowserWindow {
  getBounds = jest.fn(() => ({ x: 1, y: 2, width: 3, height: 4 }));
  loadURL = jest.fn();
  on = jest.fn((channel, cb) => (electron.callbacks[channel] = cb));
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
  on: jest.fn((channel, cb) => (electron.callbacks[channel] = cb))
};

const electron = {
  // private API for testing
  callbacks: {},

  // public API
  app,
  BrowserWindow,
  clipboard,
  ipcMain
};

module.exports = electron;
