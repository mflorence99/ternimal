const callbacks = { };

const app = {
  on: jest.fn((channel, cb) => callbacks[channel] = cb),
  quit: jest.fn()
};

class BrowserWindow {
  constructor(options) {
    this.options = options;
  }
  getBounds = jest.fn();
  loadURL = jest.fn();
  on = jest.fn((channel, cb) => callbacks[channel] = cb);
  setMenu = jest.fn();
  webContents = {
    openDevTools: jest.fn()
  }
}

const ipcMain = {
  on: jest.fn((channel, cb) => callbacks[channel] = cb)
};

const electron = {
  callbacks,
  app,
  BrowserWindow,
  ipcMain
}

module.exports = electron;
