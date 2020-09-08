import './readdir';

import { Channels } from '../common';

import { fsLoadPathRequest } from './readdir';
import { makeDescriptor } from './readdir';
import { on } from '../common';

import 'jest-extended';

import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

// @see __mocks__/electron.ts
// @see __mocks__/filewatcher.ts

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
    expect(theWindow.webContents.send).toHaveBeenCalledWith(
      Channels.fsLoadPathSuccess,
      __dirname,
      expect.anything()
    );
  });

  test('fsLoadPathRequest (failure)', async () => {
    await fsLoadPathRequest(undefined, '/root');
    expect(theWindow.webContents.send).toHaveBeenNthCalledWith(
      1,
      Channels.error,
      expect.stringMatching(/^EACCES/)
    );
    expect(theWindow.webContents.send).toHaveBeenNthCalledWith(
      2,
      Channels.fsLoadPathFailure,
      '/root'
    );
  });

  test('makeDescriptor', () => {
    const root = __dirname;
    const name = path.basename(__filename);
    const stat = fs.lstatSync(__filename);
    const desc = makeDescriptor(root, name, stat);
    expect(desc).toEqual(
      expect.objectContaining({
        isFile: true,
        mode: '-rw-rw-r--',
        name: name,
        path: __filename,
        user: userInfo.username
      })
    );
  });

  test('watcher fallback', () => {
    on('fallback')(42);
    expect(theWindow.webContents.send).toHaveBeenCalledWith(
      Channels.error,
      expect.stringMatching(/ 42 /)
    );
  });
});
