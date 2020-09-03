import './readdir';

import { Channels } from '../common';

import { fsLoadPathRequest } from './readdir';
import { makeDescriptor } from './readdir';

import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

const userInfo = os.userInfo();

describe('readdir', () => {
  let theWindow;

  beforeEach(() => {
    theWindow = new BrowserWindow({});
    globalThis.theWindow = theWindow;
  });

  test('fsLoadPathRequest', async () => {
    await fsLoadPathRequest(undefined, __dirname);
    const calls = theWindow.webContents.send.mock.calls;
    expect(calls[0][0]).toEqual(Channels.fsLoadPathSuccess);
    expect(calls[0][1]).toEqual(__dirname);
    expect(calls[0][2].length).toBeGreaterThan(1);
  });

  test('fsLoadPathRequest (failure)', async () => {
    await fsLoadPathRequest(undefined, '/root');
    const calls = theWindow.webContents.send.mock.calls;
    expect(calls[0][0]).toEqual(Channels.error);
    expect(calls[0][1]).toContain('EACCES');
    expect(calls[1][0]).toEqual(Channels.fsLoadPathFailure);
    expect(calls[1][1]).toEqual('/root');
  });

  test('makeDescriptor', () => {
    const root = __dirname;
    const name = path.basename(__filename);
    const stat = fs.lstatSync(__filename);
    const desc = makeDescriptor(root, name, stat);
    expect(desc.isFile).toBe(true);
    expect(desc.mode).toEqual('-rw-rw-r--');
    expect(desc.name).toEqual(name);
    expect(desc.path).toEqual(__filename);
    expect(desc.user).toEqual(userInfo.username);
  });
});
