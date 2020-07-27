/* eslint-disable @typescript-eslint/naming-convention */
const app = {
  on: jest.fn((channel, cb) => electron.callbacks[channel] = cb),
  quit: jest.fn()
};

// @see https://github.com/facebook/jest/issues/7432
const createWaitableMock = (): Function => {
  let resolve;
  let times;
  let calledCount = 0;
  const mock = jest.fn();
  mock.mockImplementation(() => {
    calledCount += 1;
    if (resolve && calledCount >= times) {
      resolve();
    }
  });
  (mock as any).waitToHaveBeenCalled = (t): Promise<any> => {
    times = t;
    return new Promise(r => {
      resolve = r;
    });
  };
  return mock;
};

class BrowserWindow {

  getBounds = jest.fn(() => ({ x: 1, y: 2, width: 3, height: 4 }));
  loadURL = jest.fn();
  on = jest.fn((channel, cb) => electron.callbacks[channel] = cb);
  setMenu = jest.fn();
  webContents = {
    openDevTools: jest.fn(),
    send: jest.fn(),
    reload: jest.fn()
  };

  constructor(public options: any) {  }
  
}

const ipcMain = {
  on: jest.fn((channel, cb) => electron.callbacks[channel] = cb)
};

const electron = {

  // private API for testing
  callbacks: { },
  createWaitableMock,

  // public API
  app,
  BrowserWindow,
  ipcMain

};

module.exports = electron;
