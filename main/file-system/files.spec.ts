import './files';

import { Channels } from '../common';

import { report } from './files';

import * as electron from 'electron';
import * as fs from 'fs-extra';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

const mockFileSystem = require('mock-fs');

describe('files', () => {
  const event = {
    returnValue: null
  };
  let theWindow;

  afterEach(() => {
    mockFileSystem.restore();
  });

  beforeEach(() => {
    event.returnValue = null;
    theWindow = new BrowserWindow({});
    globalThis.theWindow = theWindow;
    mockFileSystem({
      '/fake/file': 'xxx'
    });
  });

  test('report', () => {
    report(['this', 'that', 'another']);
    const calls = theWindow.webContents.send.mock.calls;
    expect(calls[0][0]).toEqual(Channels.error);
    expect(calls[0][1]).toEqual('Permission denied this and 2 others');
  });

  test('fsDelete', async () => {
    expect.assertions(3);
    expect(fs.lstatSync('/fake/file')).toBeTruthy();
    const callbacks = electron['callbacks'];
    await callbacks[Channels.fsDelete](undefined, ['/fake/file']);
    // @see https://stackoverflow.com/questions/46042613/
    try {
      fs.lstatSync('/fake/file');
    } catch (error) {
      expect(error.message).toBeTruthy();
      expect(theWindow.webContents.send).toHaveBeenCalledTimes(0);
    }
  });

  test('fsExists', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.fsExists](event, '/fake/file');
    expect(event.returnValue).toBe(true);
    callbacks[Channels.fsExists](event, __filename);
    expect(event.returnValue).toBe(false);
  });

  test('fsNewDir', async () => {
    expect.assertions(2);
    const callbacks = electron['callbacks'];
    await callbacks[Channels.fsNewDir](undefined, '/fake/base', 'directory');
    // @see https://stackoverflow.com/questions/46042613/
    try {
      expect(fs.lstatSync('/fake/directory')).toBeTruthy();
      expect(theWindow.webContents.send).toHaveBeenCalledTimes(0);
    } catch (error) {}
  });

  test('fsNewFile', async () => {
    expect.assertions(2);
    const callbacks = electron['callbacks'];
    await callbacks[Channels.fsNewFile](undefined, '/fake/base', 'file.txt');
    // @see https://stackoverflow.com/questions/46042613/
    try {
      expect(fs.lstatSync('/fake/file.txt')).toBeTruthy();
      expect(theWindow.webContents.send).toHaveBeenCalledTimes(0);
    } catch (error) {}
  });

  test('fsRename', async () => {
    expect.assertions(2);
    const callbacks = electron['callbacks'];
    await callbacks[Channels.fsRename](undefined, '/fake/file', 'file.txt');
    // @see https://stackoverflow.com/questions/46042613/
    try {
      expect(fs.lstatSync('/fake/file.txt')).toBeTruthy();
      expect(theWindow.webContents.send).toHaveBeenCalledTimes(0);
    } catch (error) {}
  });

  test('fsTouch', async () => {
    expect.assertions(2);
    const callbacks = electron['callbacks'];
    await callbacks[Channels.fsTouch](undefined, ['/fake/file']);
    // @see https://stackoverflow.com/questions/46042613/
    try {
      const stat = fs.lstatSync('/fake/file');
      expect(Date.now() - stat.mtimeMs).toBeLessThan(1000);
      expect(theWindow.webContents.send).toHaveBeenCalledTimes(0);
    } catch (error) {}
  });

  test('fsTrash', async () => {
    expect.assertions(3);
    expect(fs.lstatSync('/fake/file')).toBeTruthy();
    const callbacks = electron['callbacks'];
    await callbacks[Channels.fsTrash](undefined, ['/fake/file']);
    // @see https://stackoverflow.com/questions/46042613/
    try {
      fs.lstatSync('/fake/file');
    } catch (error) {
      expect(error.message).toBeTruthy();
      expect(theWindow.webContents.send).toHaveBeenCalledTimes(0);
    }
  });
});
