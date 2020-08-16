/* eslint-disable @typescript-eslint/no-misused-promises */
import { Channels } from '../common/channels';
import { LongRunningOp } from '../common/long-running-op';

import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as recursive from 'recursive-readdir';
import * as util from 'util';

const { ipcMain } = electron;

let cancelID = null;

const copyAndMover = async (
  id: string,
  froms: string[],
  to: string,
  op: 'copy' | 'move'
): Promise<void> => {
  const theWindow = globalThis.theWindow;

  // kick off the long-running op
  const longRunningOp: LongRunningOp = {
    id,
    item: null,
    progress: 0,
    running: true
  };
  theWindow?.webContents.send(Channels.longRunningProgress, longRunningOp);

  // NOTE: util typing doesn't seem right
  const access = util.promisify(fs.access) as Function;
  const copy = util.promisify(fs.copy) as Function;
  const copyOpts = {
    errorOnExist: true,
    overwrite: false,
    preserveTimestamps: true
  };
  const lstat = util.promisify(fs.lstat);
  const move = util.promisify(fs.copy) as Function;
  const moveOpts = { overwrite: false };
  const recurse = util.promisify(recursive);

  try {
    // what to write to?
    let stat = (await lstat(to)) as fs.Stats;
    to = stat.isDirectory() ? to : path.dirname(to);

    // make sure it is writable
    await access(to, fs.constants.W_OK);

    // itemize each of the froms
    let acc = [];
    for (const from of froms) {
      stat = (await lstat(from)) as fs.Stats;
      if (stat.isDirectory()) acc = acc.concat(await recurse(from));
      else acc.push(from);
    }
    const ifroms = acc.flat();

    // copy or move froms => to
    ifroms.forEach(async (ifrom, ix: number) => {
      if (cancelID === id) throw new Error(`File ${op} canceled by request`);
      const base = path.basename(ifrom);
      const ito = path.join(to, base);
      console.log(ifrom);
      op === 'copy'
        ? await copy(ifrom, ito, copyOpts)
        : await move(ifrom, ito, moveOpts);
      // indicate progress
      const scale = Math.round(((ix + 1) / ifroms.length) * 100);
      if (scale > longRunningOp.progress) {
        longRunningOp.item = ifrom;
        longRunningOp.progress = scale;
        longRunningOp.running = ix < ifroms.length - 1;
        theWindow?.webContents.send(
          Channels.longRunningProgress,
          longRunningOp
        );
      }
    });
  } catch (error) {
    longRunningOp.running = false;
    theWindow?.webContents.send(Channels.longRunningProgress, longRunningOp);
    theWindow?.webContents.send(Channels.error, error.message);
  }
};

ipcMain.on(Channels.fsCancelCopyOrMove, (_, id: string): void => {
  cancelID = id;
});

ipcMain.on(
  Channels.fsCopy,
  (_, id: string, froms: string[], to: string): void => {
    copyAndMover(id, froms, to, 'copy');
  }
);

ipcMain.on(
  Channels.fsMove,
  (_, id: string, froms: string[], to: string): void => {
    copyAndMover(id, froms, to, 'move');
  }
);
