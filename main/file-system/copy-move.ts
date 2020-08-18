/* eslint-disable @typescript-eslint/no-misused-promises */
import { Channels } from '../common';
import { LongRunningOp } from '../common';

import { longRunningOpCancelID } from '../long-running-op';

import * as async from 'async';
import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as recursive from 'recursive-readdir';
import * as util from 'util';

const { ipcMain } = electron;

const copyAndMover = async (
  id: string,
  froms: string[],
  to: string,
  op: 'copy' | 'move'
): Promise<void> => {
  const theWindow = globalThis.theWindow;

  const copyOpts = {
    errorOnExist: true,
    overwrite: false,
    preserveTimestamps: true
  };

  const moveOpts = { overwrite: false };

  const longRunningOp: LongRunningOp = {
    id,
    item: null,
    progress: 0,
    running: true
  };

  const cleanups = [],
    tos = [];

  const ifroms = [],
    itos = [];

  try {
    // what to write to?
    let stat = await fs.lstat(to);
    to = stat.isDirectory() ? to : path.dirname(to);

    // make sure it is writable
    await fs.access(to, fs.constants.W_OK);

    // match all the "froms" to a "to"
    await async.eachSeries(froms, async (from) => {
      stat = await fs.lstat(from);
      if (stat.isDirectory()) {
        // NOTE: convenient here to mark which directories
        // must be cleaned up after a move
        if (op === 'move') cleanups.push(from);
        const root = path.dirname(from);
        tos.push(path.join(to, from.substring(root.length)));
      } else tos.push(path.join(to, path.basename(from)));
    });

    // if the "to" already exists, we have to disambiguate it
    await async.eachOfSeries(tos, async (to, ix) => {
      const parsed = path.parse(to);
      // see if we are already disambiguated with this pattern
      let disamb = 1;
      // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
      const parts = parsed.name.match(/^(.+) \(([\d]+)\)$/);
      if (parts) {
        disamb = Number(parts[2]);
        parsed.name = parts[1];
      }
      while (await fs.pathExists(tos[ix]))
        tos[ix] = path.join(
          parsed.dir,
          `${parsed.name} (${disamb++})${parsed.ext}`
        );
    });

    // itemize each of the "froms" that are a direcory
    await async.eachOfSeries(froms, async (from, ix) => {
      stat = await fs.lstat(from);
      if (stat.isDirectory()) {
        const itemized = (await util.promisify(recursive)(from)) as string[];
        const root = path.dirname(from);
        itemized.forEach((ifrom) => {
          ifroms.push(ifrom);
          itos.push(path.join(tos[ix], ifrom.substring(root.length)));
        });
      } else {
        ifroms.push(from);
        itos.push(tos[ix]);
      }
    });

    // kick off the long-running op
    theWindow?.webContents.send(Channels.longRunningOpProgress, longRunningOp);

    // copy or move froms => to
    await async.eachOfSeries(ifroms, async (ifrom: string, ix: number) => {
      // cancel if requested
      if (longRunningOpCancelID === id)
        throw new Error(`File ${op} canceled by request`);

      // execute copy or move
      op === 'copy'
        ? await fs.copy(ifrom, itos[ix], copyOpts)
        : await fs.move(ifrom, itos[ix], moveOpts);

      // indicate progress
      // cut out noise by tripping at most 100 times
      const scale = Math.round(((ix + 1) / ifroms.length) * 100);
      if (scale > longRunningOp.progress) {
        longRunningOp.item = ifrom;
        longRunningOp.progress = scale;
        longRunningOp.running = ix < ifroms.length - 1;
        theWindow?.webContents.send(
          Channels.longRunningOpProgress,
          longRunningOp
        );
      }
    });
  } catch (error) {
    theWindow?.webContents.send(Channels.error, error.message);
    return;
  } finally {
    // always complete the long-running op
    longRunningOp.running = false;
    theWindow?.webContents.send(Channels.longRunningOpProgress, longRunningOp);
  }

  // after a move, make sure that the "from" directory is gone
  for (const cleanup of cleanups) await fs.remove(cleanup);

  // send completed message
  const channel =
    op === 'copy' ? Channels.fsCopyCompleted : Channels.fsMoveCompleted;
  theWindow?.webContents.send(channel, id, froms, tos);
};

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
