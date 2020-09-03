/* eslint-disable @typescript-eslint/no-misused-promises */
import { Channels } from '../common';

import * as async from 'async';
import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as util from 'util';

import touch = require('touch');
import trash = require('trash');

const { ipcMain } = electron;

const forEachPath = async (
  paths: string[],
  cb: (path: string) => Promise<any>
): Promise<void> => {
  try {
    const failures = await async.reject(paths, async (path) => {
      try {
        await cb(path);
        return true;
      } catch (error) {
        return false;
      }
    });
    if (failures.length > 0) report(failures);
  } catch (ignored) {}
};

export const report = (failures: string[]): void => {
  const theWindow = globalThis.theWindow;
  let message = `Permission denied ${failures[0]}`;
  if (failures.length === 2) message += ' and one other';
  if (failures.length > 2) message += ` and ${failures.length - 1} others`;
  theWindow?.webContents.send(Channels.error, message);
};

ipcMain.on(
  Channels.fsDelete,
  async (_, paths: string[]): Promise<void> => {
    await forEachPath(paths, (path: string) => fs.remove(path));
  }
);

ipcMain.on(Channels.fsExists, (event: Event, path: string): void => {
  try {
    fs.accessSync(path);
    event.returnValue = true;
  } catch (error) {
    event.returnValue = false;
  }
});

ipcMain.on(
  Channels.fsNewDir,
  async (_, base: string, name: string): Promise<void> => {
    const newDir = path.join(path.dirname(base), name);
    try {
      await fs.ensureDir(newDir, { mode: 0o2775 });
    } catch (error) {
      report([newDir]);
    }
  }
);

ipcMain.on(
  Channels.fsNewFile,
  async (_, base: string, name: string): Promise<void> => {
    const newPath = path.join(path.dirname(base), name);
    try {
      const touchAsync = util.promisify(touch) as Function;
      await touchAsync(newPath, { force: true });
    } catch (error) {
      report([newPath]);
    }
  }
);

ipcMain.on(
  Channels.fsRename,
  async (_, origPath: string, newName: string): Promise<void> => {
    try {
      await fs.rename(origPath, path.join(path.dirname(origPath), newName));
    } catch (error) {
      report([origPath]);
    }
  }
);

ipcMain.on(
  Channels.fsTouch,
  async (_, paths: string[]): Promise<void> => {
    await forEachPath(paths, (path: string) =>
      touch(path, { force: true, nocreate: true, time: new Date() })
    );
  }
);

ipcMain.on(
  Channels.fsTrash,
  async (_, paths: string[]): Promise<void> => {
    await forEachPath(paths, (path: string) => trash(path));
  }
);
