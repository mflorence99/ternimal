/* eslint-disable @typescript-eslint/no-misused-promises */
import { Channels } from '../common';

import { isLongRunningOpCanceled } from '../long-running-op';
import { numParallelOps } from '../common';
import { rreaddir } from './rreaddir';

import * as async from 'async';
import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';

const { ipcMain } = electron;

const copyOpts = {
  errorOnExist: false,
  overwrite: false,
  preserveTimestamps: true
};

const moveOpts = { overwrite: false };

export const fsCopyOrMove = async (
  id: string,
  froms: string[],
  to: string,
  op: 'copy' | 'move'
): Promise<void> => {
  const theWindow = globalThis.theWindow;
  // kick off the long-running op
  theWindow?.webContents.send(Channels.longRunningOpProgress, {
    id: id,
    item: null,
    progress: 0,
    running: true
  });
  try {
    // what to write to?
    const stat = await fs.lstat(to);
    to = stat.isDirectory() ? to : path.dirname(to);
    // make sure everything that needs to be is readable
    await ensureReadability(froms);
    // make sure everything that needs to be is writable
    op === 'move'
      ? await ensureWritability([...froms, to])
      : await ensureWritability([to]);
    // match all the "froms" to a "to"
    const tos = await matchFromsWithTos(froms, to);
    // if the "to" already exists, we have to disambiguate it
    await disambiguateTos(tos);
    // itemize each of the "froms" that are a direcory
    const [ifroms, itos] = await itemizeFroms(froms, tos);
    // copy or move itemized froms => to
    await fsCopyOrMoveImpl(id, ifroms, itos, op);
    // after a move, make sure that the "from" directories are gone
    if (op === 'move') cleanupAfterMove(froms);
    // send completed message
    const channel =
      op === 'copy' ? Channels.fsCopyCompleted : Channels.fsMoveCompleted;
    theWindow?.webContents.send(channel + id, froms, tos);
  } catch (error) {
    theWindow?.webContents.send(Channels.error, error.message);
  } finally {
    // always complete the long-running op
    theWindow?.webContents.send(Channels.longRunningOpProgress, {
      id: id,
      item: null,
      progress: 100,
      running: false
    });
  }
};

export const fsCopyOrMoveImpl = async (
  id: string,
  ifroms: string[],
  itos: string[],
  op: 'copy' | 'move'
): Promise<void> => {
  let progress = 0;
  const theWindow = globalThis.theWindow;
  // NOTE: eachOfLimit seems to trip over itself, and
  // triggers EEXIST errors
  await async.eachOfSeries(ifroms, async (ifrom: string, ix: number) => {
    isLongRunningOpCanceled(id, `File ${op} canceled by request`);
    op === 'copy'
      ? await fs.copy(ifrom, itos[ix], copyOpts)
      : await fs.move(ifrom, itos[ix], moveOpts);
    // NOTE: cut out noise by tripping at most 100 times
    const scale = Math.round(((ix + 1) / ifroms.length) * 100);
    if (scale > progress) {
      theWindow?.webContents.send(Channels.longRunningOpProgress, {
        id: id,
        item: ifrom,
        progress: scale,
        running: ix < ifroms.length - 1
      });
      progress = scale;
    }
  });
};

// NOTE: necessary to remove any empty directories
export const cleanupAfterMove = async (froms: string[]): Promise<void> => {
  await async.eachLimit(froms, numParallelOps, async (from) => {
    const stat = await fs.lstat(from);
    if (stat.isDirectory()) await fs.remove(from);
  });
};

export const disambiguateTos = async (tos: string[]): Promise<void> => {
  await async.eachOfLimit(tos, numParallelOps, async (to, ix) => {
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
};

export const ensureReadability = async (paths: string[]): Promise<void> => {
  await async.eachLimit(paths, numParallelOps, async (path) => {
    await fs.access(path, fs.constants.R_OK);
  });
};

export const ensureWritability = async (paths: string[]): Promise<void> => {
  await async.eachLimit(paths, numParallelOps, async (path) => {
    await fs.access(path, fs.constants.W_OK);
  });
};

export const itemizeFroms = async (
  froms: string[],
  tos: string[]
): Promise<[string[], string[]]> => {
  const ifroms = [],
    itos = [];
  await async.eachOfSeries(froms, async (from, ix) => {
    const stat = await fs.lstat(from);
    if (stat.isDirectory()) {
      const hash = {};
      await rreaddir(from, hash);
      const itemized = Object.keys(hash);
      itemized.forEach((ifrom) => {
        ifroms.push(ifrom);
        itos.push(path.join(tos[ix], ifrom.substring(from.length)));
      });
    } else {
      ifroms.push(from);
      itos.push(tos[ix]);
    }
  });
  return [ifroms, itos];
};

export const matchFromsWithTos = async (
  froms: string[],
  to: string
): Promise<string[]> => {
  const tos = [];
  // NOTE: async.reduce doesn't seem to compile with await
  await async.eachSeries(froms, async (from) => {
    const stat = await fs.lstat(from);
    if (stat.isDirectory()) {
      const root = path.dirname(from);
      tos.push(path.join(to, from.substring(root.length)));
    } else tos.push(path.join(to, path.basename(from)));
  });
  return tos;
};

ipcMain.on(
  Channels.fsCopy,
  (_, id: string, froms: string[], to: string): void => {
    fsCopyOrMove(id, froms, to, 'copy');
  }
);

ipcMain.on(
  Channels.fsMove,
  (_, id: string, froms: string[], to: string): void => {
    fsCopyOrMove(id, froms, to, 'move');
  }
);
