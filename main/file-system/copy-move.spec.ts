import './copy-move';

import { disambiguateTos } from './copy-move';
import { itemizeFroms } from './copy-move';
import { matchFromsWithTos } from './copy-move';

import * as electron from 'electron';
import * as process from 'process';

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

  test('disambiguateTos', async () => {
    const tos = ['/target/source', '/target/file'];
    await disambiguateTos(tos);
    expect(tos).toEqual(['/target/source', '/target/file (1)']);
  });

  test('itemizeFroms', async () => {
    const froms = ['/source', '/fake/file'];
    const tos = ['/target', '/target/file (1)'];
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
