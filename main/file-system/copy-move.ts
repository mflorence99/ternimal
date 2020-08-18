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

  // what to write to?
  let stat = await fs.lstat(to);
  to = stat.isDirectory() ? to : path.dirname(to);

  // make sure it is writable
  try {
    await fs.access(to, fs.constants.W_OK);
  } catch (err) {
    theWindow?.webContents.send(Channels.error, err.message);
    return;
  }

  // itemize each of the "froms" and match them to a "to"
  const ifroms = [],
    itos = [];
  const cleanups = [],
    tos = [];
  for (const from of froms) {
    stat = await fs.lstat(from);
    if (stat.isDirectory()) {
      if (op === 'move') cleanups.push(from);
      const itemized = (await util.promisify(recursive)(from)) as string[];
      const root = path.dirname(from);
      itemized.forEach((ifrom) => {
        ifroms.push(ifrom);
        itos.push(path.join(to, ifrom.substring(root.length)));
      });
      tos.push(path.join(to, from.substring(root.length)));
    } else {
      ifroms.push(from);
      const ito = path.join(to, path.basename(from));
      itos.push(ito);
      tos.push(ito);
    }
  }

  // kick off the long-running op
  const longRunningOp: LongRunningOp = {
    id,
    item: null,
    progress: 0,
    running: true
  };
  theWindow?.webContents.send(Channels.longRunningOpProgress, longRunningOp);

  // copy or move froms => to
  async.eachOfSeries(
    ifroms,
    async (ifrom: string, ix: number) => {
      // cancel if requested
      if (longRunningOpCancelID === id)
        throw new Error(`File ${op} canceled by request`);

      // if the "to" already exists, we have to disambiguate it
      const parsed = path.parse(itos[ix]);
      for (let iy = 1; await fs.pathExists(itos[ix]); iy++)
        itos[ix] = path.join(parsed.dir, `${parsed.name} (${iy})${parsed.ext}`);

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
    },
    async (err) => {
      // whatever happened, we're done
      longRunningOp.running = false;
      theWindow?.webContents.send(
        Channels.longRunningOpProgress,
        longRunningOp
      );

      // send an error meesage if we failed
      if (err) theWindow?.webContents.send(Channels.error, err.message);
      else {
        // after a move, make sure that the "from" directory is gone
        for (const cleanup of cleanups) await fs.remove(cleanup);
        // send completed message
        const channel =
          op === 'copy' ? Channels.fsCopyCompleted : Channels.fsMoveCompleted;
        theWindow?.webContents.send(channel, id, froms, tos);
      }
    }
  );
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
