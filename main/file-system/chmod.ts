/* eslint-disable @typescript-eslint/no-misused-promises */
import { Channels } from '../common/channels';
import { Chmod } from '../common/chmod';
import { FileDescriptor } from '../common/file-system';

import * as async from 'async';
import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as Mode from 'stat-mode';
import * as util from 'util';

const { ipcMain } = electron;

// NOTE: we want "undo" capability, so we need FileDescriptors, not just paths

const chmoder = (descs: FileDescriptor[], chmod: Chmod): void => {
  async.filter(
    descs,
    async (desc) => {
      try {
        // attempt to change the mode of every supplied path
        const stat = await util.promisify(fs.lstat)(desc.path);
        const mode = Mode(stat as fs.Stats);
        mode.owner.read = chmod.owner.read ?? mode.owner.read;
        mode.owner.write = chmod.owner.write ?? mode.owner.write;
        mode.owner.execute = chmod.owner.execute ?? mode.owner.execute;
        mode.group.read = chmod.group.read ?? mode.group.read;
        mode.group.write = chmod.group.write ?? mode.group.write;
        mode.group.execute = chmod.group.execute ?? mode.group.execute;
        mode.others.read = chmod.others.read ?? mode.others.read;
        mode.others.write = chmod.others.write ?? mode.others.write;
        mode.others.execute = chmod.others.execute ?? mode.others.execute;
        await util.promisify(fs.chmod)(desc.path, mode.toOctal());
        return true;
      } catch (error) {
        return false;
      }
    },
    (_, successes) => {
      // now we have a list of those that succeeded
      // if any failed, we want to undo those that succeeded
      if (descs.length !== successes.length) {
        const failures = descs.filter(
          (desc) => !successes.find((success) => success.path === desc.path)
        );
        report(failures);
        if (successes.length > 0) undo(successes);
      }
    }
  );
};

const report = (failures: FileDescriptor[]): void => {
  if (failures.length > 0) {
    const theWindow = globalThis.theWindow;
    let message = `Permission denied ${failures[0].path}`;
    if (failures.length === 2) message += ' and one other';
    if (failures.length > 2) message += ` and ${failures.length - 1} others`;
    theWindow?.webContents.send(Channels.error, message);
  }
};

const undo = (descs: FileDescriptor[]): void => {
  async.each(descs, async (desc) => {
    // reset the mode of every supplied path
    const stat = await util.promisify(fs.lstat)(desc.path);
    const mode = Mode(stat as fs.Stats);
    mode.owner.read = desc.mode[1] === 'r';
    mode.owner.write = desc.mode[2] === 'w';
    mode.owner.execute = desc.mode[3] === 'x';
    mode.group.read = desc.mode[4] === 'r';
    mode.group.write = desc.mode[5] === 'w';
    mode.group.execute = desc.mode[6] === 'x';
    mode.others.read = desc.mode[7] === 'r';
    mode.others.write = desc.mode[8] === 'w';
    mode.others.execute = desc.mode[9] === 'x';
    await util.promisify(fs.chmod)(desc.path, mode.toOctal());
  });
};

ipcMain.on(
  Channels.fsChmod,
  (_, descs: FileDescriptor[], chmod: Chmod): void => {
    chmoder(descs, chmod);
  }
);
