/* eslint-disable @typescript-eslint/naming-convention */
const app = {
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

const ipcMain = {
  on: jest.fn((channel, cb) => (electron.callbacks[channel] = cb))
};

const electron = {
  // private API for testing
  callbacks: {},

  // public API
  app,
  BrowserWindow,
  ipcMain
};

module.exports = electron;
