/* eslint-disable @typescript-eslint/no-misused-promises */
import { AnalysisByExt } from '../common';
import { Channels } from '../common';

import { makeColor } from './icons';
import { makeIcon } from './icons';
import { numParallelOps } from '../common';
import { saveColors } from './icons';

import * as async from 'async';
import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as recursive from 'recursive-readdir';
import * as util from 'util';

const { ipcMain } = electron;

const business = async (paths: string[]): Promise<void> => {
  const theWindow = globalThis.theWindow;
  try {
    const stats = await itemizePaths(paths);
    const analysis = performAnalysis(stats);
    theWindow?.webContents.send(Channels.fsAnalyzeCompleted, analysis);
  } catch (error) {
    theWindow?.webContents.send(Channels.fsAnalyzeCompleted, {});
    theWindow?.webContents.send(Channels.error, error.message);
  }
};

const itemizePaths = async (
  paths: string[]
): Promise<Record<string, fs.Stats>> => {
  let hash: Record<string, fs.Stats> = {};
  await async.eachLimit(paths, numParallelOps, async (path) => {
    const stat = await fs.lstat(path);
    if (stat.isDirectory()) {
      const itemized = (await util.promisify(recursive)(path)) as string[];
      hash = Object.assign(hash, await statsByPath(itemized));
    } else hash[path] = stat;
  });
  return hash;
};

const performAnalysis = (stats: Record<string, fs.Stats>): AnalysisByExt => {
  const analysis: AnalysisByExt = {};
  Object.entries(stats).forEach(([name, stat]) => {
    const ext = path.extname(name);
    let data = analysis[ext];
    if (!data) {
      data = {
        color: makeColor(name, stat),
        count: 0,
        icon: makeIcon(name, stat),
        size: 0
      };
      analysis[ext] = data;
    }
    data.count += 1;
    data.size += stat.size;
  });
  saveColors();
  return analysis;
};

const statsByPath = async (
  paths: string[]
): Promise<Record<string, fs.Stats>> => {
  const hash = Object.fromEntries(paths.map((path) => [path, path]));
  return await async.mapValuesLimit(
    hash,
    numParallelOps,
    async (path) => await fs.lstat(path)
  );
};

ipcMain.on(Channels.fsAnalyze, (_, paths: string[]): void => {
  business(paths);
});
