import './analyze';

import { AnalysisByExt } from '../common';
import { Channels } from '../common';

import { fsAnalyze } from './analyze';
import { itemizePaths } from './analyze';
import { performAnalysis } from './analyze';

import 'jest-extended';

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
    expect(theWindow.webContents.send).toHaveBeenCalledWith(
      Channels.fsAnalyzeCompleted,
      expect.objectContaining({
        '.ts': {
          color: expect.stringMatching(/^var\(.*\)$/),
          count: expect.any(Number),
          icon: ['far', 'file-code'],
          size: expect.any(Number)
        }
      })
    );
  });

  test('fsAnalyze (failure)', async () => {
    await fsAnalyze(undefined, ['/root']);
    expect(theWindow.webContents.send).toHaveBeenNthCalledWith(
      1,
      Channels.fsAnalyzeCompleted,
      {}
    );
    expect(theWindow.webContents.send).toHaveBeenNthCalledWith(
      2,
      Channels.error,
      expect.stringMatching(/^EACCES/)
    );
  });

  test('itemizePaths (directory)', async () => {
    const hash: Record<string, fs.Stats> = await itemizePaths([__dirname]);
    expect(hash).toEqual(
      expect.objectContaining({
        [__filename]: expect.objectContaining({
          size: expect.any(Number)
        })
      })
    );
  });

  test('itemizePaths (file)', async () => {
    const hash: Record<string, fs.Stats> = await itemizePaths([__filename]);
    expect(hash).toEqual(
      expect.objectContaining({
        [__filename]: expect.objectContaining({
          size: expect.any(Number)
        })
      })
    );
  });

  test('performAnalysis', async () => {
    const hash: Record<string, fs.Stats> = await itemizePaths([__dirname]);
    const analysis: AnalysisByExt = performAnalysis(hash);
    expect(analysis).toEqual(
      expect.objectContaining({
        '.ts': {
          color: expect.stringMatching(/^var\(.*\)/),
          count: expect.any(Number),
          icon: ['far', 'file-code'],
          size: expect.any(Number)
        }
      })
    );
  });
});
