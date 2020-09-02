import './analyze';

import { AnalysisByExt } from '../common';
import { Channels } from '../common';

import { fsAnalyze } from './analyze';
import { itemizePaths } from './analyze';
import { performAnalysis } from './analyze';
import { statsByPath } from './analyze';

import * as electron from 'electron';
import * as fs from 'fs-extra';

// @see __mocks__/electron.ts

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

describe('analyze', () => {
  let theWindow;

  beforeEach(() => {
    theWindow = new BrowserWindow({});
    globalThis.theWindow = theWindow;
  });

  test('fsAnalyze', async () => {
    await fsAnalyze(undefined, [__dirname]);
    expect(theWindow.webContents.send).toHaveBeenCalledTimes(1);
    const calls = theWindow.webContents.send.mock.calls;
    expect(calls[0][0]).toEqual(Channels.fsAnalyzeCompleted);
    const analysis: AnalysisByExt = calls[0][1];
    expect(analysis['.ts'].count).toBeGreaterThan(0);
    expect(analysis['.ts'].icon).toEqual(['far', 'file-code']);
    expect(analysis['.ts'].size).toBeGreaterThan(0);
  });

  test('itemizePaths', async () => {
    const hash: Record<string, fs.Stats> = await itemizePaths([__dirname]);
    expect(hash[__filename].size).toBeGreaterThan(0);
  });

  test('performAnalysis', async () => {
    const hash: Record<string, fs.Stats> = await itemizePaths([__dirname]);
    const analysis: AnalysisByExt = performAnalysis(hash);
    expect(analysis['.ts'].count).toBeGreaterThan(0);
    expect(analysis['.ts'].icon).toEqual(['far', 'file-code']);
    expect(analysis['.ts'].size).toBeGreaterThan(0);
  });

  test('statsByPath', async () => {
    let hash: Record<string, fs.Stats> = await statsByPath([__dirname]);
    expect(hash[__dirname].size).toBeGreaterThan(0);
    // these paths do not exist
    hash = await statsByPath(['/does/not/exist', '/not/all/there']);
    expect(hash['/does/not/exist'].size).toEqual(0);
    expect(hash['/not/all/there'].size).toEqual(0);
  });
});
