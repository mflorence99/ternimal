import './copy-move';

import { Channels } from '../common';

import { cleanupAfterMove } from './copy-move';
import { disambiguateTos } from './copy-move';
import { fsCopyOrMove } from './copy-move';
import { fsCopyOrMoveImpl } from './copy-move';
import { itemizeFroms } from './copy-move';
import { matchFromsWithTos } from './copy-move';
import { on } from '../common';

import 'jest-extended';

import * as electron from 'electron';
import * as fs from 'fs-extra';

// @see __mocks__/electron.ts

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

const mockFileSystem = require('mock-fs');

describe('copy-move', () => {
  let theWindow;

  afterEach(() => {
    mockFileSystem.restore();
  });

  beforeEach(() => {
    theWindow = new BrowserWindow({});
    globalThis.theWindow = theWindow;
    mockFileSystem({
      '/fake/file': 'ppp',
      '/source': {
        'file-a': 'xxx',
        'file-b': 'yyy',
        'file-c': 'zzz'
      },
      '/target': {
        'file': 'qqq',
        'file (1)': 'qqq'
      }
    });
  });

  test('fsCopy', async () => {
    const froms = ['/source', '/fake/file'];
    const to = '/target';
    await on(Channels.fsCopy)(undefined, 'x', froms, to);
    const itos = [
      '/target/source/file-a',
      '/target/source/file-b',
      '/target/source/file-c',
      '/target/file (2)'
    ];
    for (const ito of itos) expect(fs.existsSync(ito)).toBe(true);
  });

  test('fsCopyOrMove - copy to file', async () => {
    const froms = ['/source', '/fake/file'];
    const to = '/target/file';
    await fsCopyOrMove('x', froms, to, 'copy');
    const itos = [
      '/target/source/file-a',
      '/target/source/file-b',
      '/target/source/file-c',
      '/target/file (2)'
    ];
    for (const ito of itos) expect(fs.existsSync(ito)).toBe(true);
  });

  test('fsCopyOrMove - error', async () => {
    await fsCopyOrMove('x', ['/does/not/exist'], '/not/all/there', 'copy');
    expect(theWindow.webContents.send).toHaveBeenNthCalledWith(
      1,
      Channels.longRunningOpProgress,
      expect.objectContaining({
        id: 'x',
        progress: 0,
        running: true
      })
    );
    expect(theWindow.webContents.send).toHaveBeenNthCalledWith(
      2,
      Channels.error,
      expect.stringMatching(/^ENOENT/)
    );
    expect(theWindow.webContents.send).toHaveBeenNthCalledWith(
      3,
      Channels.longRunningOpProgress,
      expect.objectContaining({
        id: 'x',
        progress: 100,
        running: false
      })
    );
  });

  test('fsCopyOrMoveImpl - copy', async () => {
    const ifroms = [
      '/source/file-a',
      '/source/file-b',
      '/source/file-c',
      '/fake/file'
    ];
    const itos = [
      '/target/source/file-a',
      '/target/source/file-b',
      '/target/source/file-c',
      '/target/file (2)'
    ];
    for (const ifrom of ifroms) expect(fs.existsSync(ifrom)).toBe(true);
    await fsCopyOrMoveImpl('x', ifroms, itos, 'copy');
    for (const ito of itos) expect(fs.existsSync(ito)).toBe(true);
  });

  test('cleanupAfterMove', async () => {
    expect(fs.existsSync('/source')).toBe(true);
    await cleanupAfterMove(['/source']);
    expect(fs.existsSync('/source')).toBe(false);
  });

  test('disambiguateTos', async () => {
    const tos = ['/target/source', '/target/file (1)'];
    await disambiguateTos(tos);
    expect(tos).toEqual(['/target/source', '/target/file (2)']);
  });

  test('itemizeFroms', async () => {
    const froms = ['/source', '/fake/file'];
    const tos = ['/target/source', '/target/file (2)'];
    const [ifroms, itos] = await itemizeFroms(froms, tos);
    // process.stdout.write('ifroms=' + JSON.stringify(ifroms) + '\n');
    // process.stdout.write('itos=' + JSON.stringify(itos) + '\n');
    expect(ifroms).toEqual([
      '/source/file-a',
      '/source/file-b',
      '/source/file-c',
      '/fake/file'
    ]);
    expect(itos).toEqual([
      '/target/source/file-a',
      '/target/source/file-b',
      '/target/source/file-c',
      '/target/file (2)'
    ]);
  });

  test('matchFromsWithTos', async () => {
    const froms = ['/source', '/fake/file'];
    const to = '/target';
    const tos = await matchFromsWithTos(froms, to);
    expect(tos).toEqual(['/target/source', '/target/file']);
  });

  // TODO: move deletes the source files -- which shouldn't matter
  // as the mock file system should be restored before each test --
  // but it appears that asynchromously -- somehow -- the source
  // files disappear on us! the docs warn about async code, by we are
  // are careful to await before leaving tests

  test('fsMove', async () => {
    const froms = ['/source', '/fake/file'];
    const to = '/target';
    await on(Channels.fsMove)(undefined, 'x', froms, to);
    const ifroms = [
      '/source/file-a',
      '/source/file-b',
      '/source/file-c',
      '/fake/file'
    ];
    for (const ifrom of ifroms) expect(fs.existsSync(ifrom)).toBe(false);
  });
});
