/* eslint-disable @typescript-eslint/no-misused-promises */
import { Channels } from '../common';
import { Chmod } from '../common';

import * as async from 'async';
import * as electron from 'electron';
import * as fs from 'fs-extra';

import Mode = require('stat-mode');

const { ipcMain } = electron;

export const fsChmod = async (
  _,
  paths: string[],
  chmod: Chmod
): Promise<void> => {
  const failures = validate(paths);
  if (failures.length === 0) {
    const originalStats = await statsByPath(paths);
    await fsChmodImpl(paths, originalStats, chmod);
  } else report(failures);
};

export const fsChmodImpl = async (
  paths: string[],
  originalStats: Record<string, fs.Stats>,
  chmod: Chmod
): Promise<void> => {
  await async.eachSeries(paths, async (path) => {
    const mode = Mode(originalStats[path]);
    mode.owner.read = chmod.owner.read ?? mode.owner.read;
    mode.owner.write = chmod.owner.write ?? mode.owner.write;
    mode.owner.execute = chmod.owner.execute ?? mode.owner.execute;
    mode.group.read = chmod.group.read ?? mode.group.read;
    mode.group.write = chmod.group.write ?? mode.group.write;
    mode.group.execute = chmod.group.execute ?? mode.group.execute;
    mode.others.read = chmod.others.read ?? mode.others.read;
    mode.others.write = chmod.others.write ?? mode.others.write;
    mode.others.execute = chmod.others.execute ?? mode.others.execute;
    await fs.chmod(path, mode.toOctal());
  });
};

export const report = (failures: string[]): void => {
  const theWindow = globalThis.theWindow;
  let message = `Permission denied ${failures[0]}`;
  if (failures.length === 2) message += ' and one other';
  if (failures.length > 2) message += ` and ${failures.length - 1} others`;
  theWindow?.webContents.send(Channels.error, message);
};

export const statsByPath = async (
  paths: string[]
): Promise<Record<string, fs.Stats>> => {
  const hash = Object.fromEntries(paths.map((path) => [path, path]));
  return await async.mapValuesSeries(hash, fs.lstat);
};

export const validate = (paths: string[]): string[] => {
  return paths.reduce((failures, path) => {
    try {
      fs.accessSync(path, fs.constants.F_OK | fs.constants.W_OK);
    } catch (error) {
      failures.push(path);
    }
    return failures;
  }, []);
};

ipcMain.on(Channels.fsChmod, fsChmod);
