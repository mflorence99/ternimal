/* eslint-disable @typescript-eslint/no-misused-promises */
import { AnalysisByExt } from '../common';
import { Channels } from '../common';

import { makeColor } from './icons';
import { makeIcon } from './icons';
import { numParallelOps } from '../common';
import { rreaddir } from './rreaddir';
import { rreaddirBudgetCount } from '../common';
import { rreaddirBudgetTime } from '../common';
import { saveColors } from './icons';

import * as async from 'async';
import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';

const { ipcMain } = electron;

export const fsAnalyze = async (_, paths: string[]): Promise<void> => {
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

export const itemizePaths = async (
  paths: string[]
): Promise<Record<string, fs.Stats>> => {
  const hash: Record<string, fs.Stats> = {};
  await async.eachLimit(paths, numParallelOps, async (path) => {
    const stat = await fs.lstat(path);
    if (stat.isDirectory())
      await rreaddir(path, hash, rreaddirBudgetCount, rreaddirBudgetTime);
    else hash[path] = stat;
  });
  return hash;
};

export const performAnalysis = (
  stats: Record<string, fs.Stats>
): AnalysisByExt => {
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

ipcMain.on(Channels.fsAnalyze, fsAnalyze);
