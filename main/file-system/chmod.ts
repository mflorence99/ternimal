/* eslint-disable @typescript-eslint/no-misused-promises */
import { Channels } from '../common';
import { Chmod } from '../common';

import * as async from 'async';
import * as electron from 'electron';
import * as fs from 'fs-extra';

import Mode = require('stat-mode');

const { ipcMain } = electron;

const business = async (paths: string[], chmod: Chmod): Promise<void> => {
  const originalStats = await statsByPath(paths);
  const successes = await performChmod(paths, originalStats, chmod);
  // now we have a list of those that succeeded
  // if any failed, we want to undo those that succeeded
  if (paths.length !== successes.length) {
    const failures = paths.filter(
      (path) => !successes.find((success) => success === path)
    );
    report(failures);
    if (successes.length > 0) undo(successes, originalStats);
  }
};

const performChmod = async (
  paths: string[],
  originalStats: Record<string, fs.Stats>,
  chmod: Chmod
): Promise<string[]> => {
  return await async.filterSeries(paths, async (path) => {
    try {
      await fs.access(path, fs.constants.W_OK);
      // attempt to change the mode of every supplied path
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
      return true;
    } catch (error) {
      return false;
    }
  });
};

const report = (failures: string[]): void => {
  if (failures.length > 0) {
    const theWindow = globalThis.theWindow;
    let message = `Permission denied ${failures[0]}`;
    if (failures.length === 2) message += ' and one other';
    if (failures.length > 2) message += ` and ${failures.length - 1} others`;
    theWindow?.webContents.send(Channels.error, message);
  }
};

const statsByPath = async (
  paths: string[]
): Promise<Record<string, fs.Stats>> => {
  const hash = Object.fromEntries(paths.map((path) => [path, path]));
  return await async.mapValuesSeries(
    hash,
    async (path) => await fs.lstat(path)
  );
};

const undo = (
  paths: string[],
  originalStats: Record<string, fs.Stats>
): void => {
  async.eachSeries(paths, async (path) => {
    // reset the mode of every supplied path
    const mode = Mode(originalStats[path]);
    await fs.chmod(path, mode.toOctal());
  });
};

ipcMain.on(Channels.fsChmod, (_, paths: string[], chmod: Chmod): void => {
  business(paths, chmod);
});
