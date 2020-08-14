/* eslint-disable @typescript-eslint/no-misused-promises */
import { Channels } from '../common/channels';

import * as async from 'async';
import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as touch from 'touch';
import * as trash from 'trash';

const { ipcMain } = electron;

const forEachPath = (
  paths: string[],
  cb: (path: string) => Promise<any>
): void => {
  async.reject(
    paths,
    async (path) => {
      try {
        await cb(path);
        return true;
      } catch (error) {
        return false;
      }
    },
    // NOTE: not interested in "undo" here
    (_, failures) => report(failures)
  );
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

ipcMain.on(Channels.fsDelete, (_, paths: string[]): void => {
  forEachPath(paths, (path: string) => fs.remove(path));
});

ipcMain.on(Channels.fsExists, (event: Event, path: string): void => {
  try {
    fs.accessSync(path);
    event.returnValue = true;
  } catch (error) {
    event.returnValue = false;
  }
});

ipcMain.on(Channels.fsRename, (_, origPath: string, newName: string): void => {
  fs.rename(origPath, path.join(path.dirname(origPath), newName), (err) => {
    if (err) report([origPath]);
  });
});

ipcMain.on(Channels.fsTouch, (_, paths: string[]): void => {
  forEachPath(paths, (path: string) =>
    touch(path, { force: true, nocreate: true, time: new Date() })
  );
});

ipcMain.on(Channels.fsTrash, (_, paths: string[]): void => {
  forEachPath(paths, (path: string) => trash(path));
});
