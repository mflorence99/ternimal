import './files';

import { Channels } from '../common';

import { on } from '../common';
import { report } from './files';

import 'jest-extended';

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
      '/root': mockFileSystem.directory({ mode: 0, items: {} }),
      '/fake/file': 'xxx'
    });
  });

  test('fsDelete', async () => {
    expect(fs.existsSync('/fake/file')).toBeTrue();
    await on(Channels.fsDelete)(undefined, ['/fake/file']);
    expect(fs.existsSync('/fake/file')).toBeFalse();
  });

  test('fsExists', () => {
    on(Channels.fsExists)(event, '/fake/file');
    expect(event.returnValue).toBeTrue();
    on(Channels.fsExists)(event, __filename);
    expect(event.returnValue).toBeFalse();
  });

  test('fsNewDir', async () => {
    await on(Channels.fsNewDir)(undefined, '/fake/base', 'directory');
    expect(fs.existsSync('/fake/directory')).toBeTrue();
  });

  test('fsNewDir - error', async () => {
    await on(Channels.fsNewDir)(undefined, '/root/base', 'dir');
    expect(theWindow.webContents.send).toHaveBeenCalledWith(
      Channels.error,
      'Permission denied /root/dir'
    );
  });

  test('fsNewFile', async () => {
    await on(Channels.fsNewFile)(undefined, '/fake/base', 'file.txt');
    expect(fs.existsSync('/fake/file.txt')).toBeTrue();
  });

  test('fsNewFile - error', async () => {
    await on(Channels.fsNewFile)(undefined, '/root/base', 'file');
    expect(theWindow.webContents.send).toHaveBeenCalledWith(
      Channels.error,
      'Permission denied /root/file'
    );
  });

  test('fsRename', async () => {
    await on(Channels.fsRename)(undefined, '/fake/file', 'file.txt');
    expect(fs.existsSync('/fake/file')).toBeFalse();
    expect(fs.existsSync('/fake/file.txt')).toBeTrue();
  });

  test('fsRename - error', async () => {
    await on(Channels.fsRename)(undefined, '/root/hoot', 'boot');
    expect(theWindow.webContents.send).toHaveBeenCalledWith(
      Channels.error,
      'Permission denied /root/hoot'
    );
  });

  test('fsTouch', async () => {
    await on(Channels.fsTouch)(undefined, ['/fake/file']);
    const stat = fs.lstatSync('/fake/file');
    expect(Date.now() - stat.mtimeMs).toBeLessThan(1000);
  });

  test('fsTouch - error', async () => {
    await on(Channels.fsTouch)(undefined, ['/root']);
    expect(theWindow.webContents.send).toHaveBeenCalledWith(
      Channels.error,
      'Permission denied /root'
    );
  });

  test('fsTrash', async () => {
    expect(fs.existsSync('/fake/file')).toBeTrue();
    await on(Channels.fsTrash)(undefined, ['/fake/file']);
    expect(fs.existsSync('/fake/file')).toBeFalse();
  });

  test('report', () => {
    report(['this']);
    expect(theWindow.webContents.send).toHaveBeenCalledWith(
      Channels.error,
      'Permission denied this'
    );
  });

  test('report', () => {
    report(['this', 'that']);
    expect(theWindow.webContents.send).toHaveBeenCalledWith(
      Channels.error,
      'Permission denied this and one other'
    );
  });

  test('report', () => {
    report(['this', 'that', 'another']);
    expect(theWindow.webContents.send).toHaveBeenCalledWith(
      Channels.error,
      'Permission denied this and 2 others'
    );
  });
});
