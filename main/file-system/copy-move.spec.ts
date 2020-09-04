import './copy-move';

import { cleanupAfterMove } from './copy-move';
import { disambiguateTos } from './copy-move';
import { fsCopyOrMove } from './copy-move';
import { fsCopyOrMoveImpl } from './copy-move';
import { itemizeFroms } from './copy-move';
import { matchFromsWithTos } from './copy-move';

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
      '/source': {
        'file-a': 'xxx',
        'file-b': 'yyy',
        'file-c': 'zzz'
      },
      '/fake/file': 'ppp',
      '/target': {
        file: 'qqq'
      }
    });
  });

  test('fsCopyOrMove', async () => {
    const froms = ['/source', '/fake/file'];
    const to = '/target';
    await fsCopyOrMove('x', froms, to, 'copy');
    const itos = [
      '/target/source/file-a',
      '/target/source/file-b',
      '/target/source/file-c',
      '/target/file (1)'
    ];
    for (const ito of itos) expect(fs.existsSync(ito)).toBe(true);
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
      '/target/file (1)'
    ];
    await fsCopyOrMoveImpl('x', ifroms, itos, 'copy');
    for (const ito of itos) expect(fs.existsSync(ito)).toBe(true);
  });

  test('fsCopyOrMoveImpl - move', async () => {
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
      '/target/file (1)'
    ];
    await fsCopyOrMoveImpl('x', ifroms, itos, 'move');
    for (const ifrom of ifroms) expect(fs.existsSync(ifrom)).toBe(false);
    for (const ito of itos) expect(fs.existsSync(ito)).toBe(true);
  });

  test('cleanupAfterMove', async () => {
    expect(fs.existsSync('/source')).toBe(true);
    await cleanupAfterMove(['/source']);
    expect(fs.existsSync('/source')).toBe(false);
  });

  test('disambiguateTos', async () => {
    const tos = ['/target/source', '/target/file'];
    await disambiguateTos(tos);
    expect(tos).toEqual(['/target/source', '/target/file (1)']);
  });

  test('itemizeFroms', async () => {
    const froms = ['/source', '/fake/file'];
    const tos = ['/target/source', '/target/file (1)'];
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
      '/target/file (1)'
    ]);
  });

  test('matchFromsWithTos', async () => {
    const froms = ['/source', '/fake/file'];
    const to = '/target';
    const tos = await matchFromsWithTos(froms, to);
    expect(tos).toEqual(['/target/source', '/target/file']);
  });
});
