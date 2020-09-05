import './chmod';

import { Channels } from '../common';
import { Chmod } from '../common';

import { fsChmod } from './chmod';
import { fsChmodImpl } from './chmod';
import { report } from './chmod';
import { statsByPath } from './chmod';

import * as electron from 'electron';
import * as fs from 'fs-extra';

// @see __mocks__/electron.ts

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

const mockFileSystem = require('mock-fs');

describe('chmod', () => {
  let theWindow;

  afterEach(() => {
    mockFileSystem.restore();
  });

  beforeEach(() => {
    theWindow = new BrowserWindow({});
    globalThis.theWindow = theWindow;
    mockFileSystem({
      '/fake/file': 'xxx'
    });
  });

  test('fsChmod', async () => {
    const paths = ['/fake/file'];
    const chmod: Chmod = {
      group: {
        execute: true,
        read: true,
        write: true
      },
      others: {
        execute: true,
        read: true,
        write: true
      },
      owner: {
        execute: true,
        read: true,
        write: true
      }
    };
    await fsChmod(undefined, paths, chmod);
    const stat = fs.lstatSync('/fake/file');
    expect(stat.mode).toEqual(33279);
  });

  test('fsChmod (failure)', async () => {
    const paths = ['/fake/file', '/does/not/exist'];
    const chmod: Chmod = {
      group: {
        execute: true,
        read: true,
        write: true
      },
      others: {
        execute: true,
        read: true,
        write: true
      },
      owner: {
        execute: true,
        read: true,
        write: true
      }
    };
    await fsChmod(undefined, paths, chmod);
    const calls = theWindow.webContents.send.mock.calls;
    expect(calls[0][0]).toEqual(Channels.error);
    expect(calls[0][1]).toEqual('Permission denied /does/not/exist');
    const stat = fs.lstatSync('/fake/file');
    expect(stat.mode).toEqual(33206);
  });

  test('fsChmodImpl', async () => {
    const paths = ['/fake/file'];
    const originalStats = await statsByPath(paths);
    const chmod: Chmod = {
      group: {
        execute: true,
        read: true,
        write: true
      },
      others: {
        execute: true,
        read: true,
        write: true
      },
      owner: {
        execute: true,
        read: true,
        write: true
      }
    };
    await fsChmodImpl(paths, originalStats, chmod);
    const stat = fs.lstatSync('/fake/file');
    expect(stat.mode).toEqual(33279);
  });

  test('report', () => {
    report(['this']);
    const calls = theWindow.webContents.send.mock.calls;
    expect(calls[0][0]).toEqual(Channels.error);
    expect(calls[0][1]).toEqual('Permission denied this');
  });

  test('report', () => {
    report(['this', 'that']);
    const calls = theWindow.webContents.send.mock.calls;
    expect(calls[0][0]).toEqual(Channels.error);
    expect(calls[0][1]).toEqual('Permission denied this and one other');
  });

  test('report', () => {
    report(['this', 'that', 'another']);
    const calls = theWindow.webContents.send.mock.calls;
    expect(calls[0][0]).toEqual(Channels.error);
    expect(calls[0][1]).toEqual('Permission denied this and 2 others');
  });

  test('statsByPath', async () => {
    const hash: Record<string, fs.Stats> = await statsByPath(['/fake/file']);
    expect(hash['/fake/file'].size).toBeGreaterThan(0);
  });
});
