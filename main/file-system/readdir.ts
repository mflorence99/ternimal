/* eslint-disable @typescript-eslint/no-misused-promises */
import { Channels } from '../common';
import { FileDescriptor } from '../common';

import { makeColor } from './icons';
import { makeIcon } from './icons';
import { saveColors } from './icons';

import * as async from 'async';
import * as electron from 'electron';
import * as filewatcher from 'filewatcher';
import * as fs from 'fs-extra';
import * as Mode from 'stat-mode';
import * as os from 'os';
import * as path from 'path';

const { ipcMain } = electron;

const userInfo = os.userInfo();
const watcher = filewatcher({ debounce: 10 });

const isExecutable = (mode, uid: number, gid: number): boolean => {
  return (
    mode.others.execute ||
    (userInfo.uid === uid && mode.owner.execute) ||
    (userInfo.gid === gid && mode.group.execute)
  );
};

const isReadable = (mode, uid: number, gid: number): boolean => {
  return (
    mode.others.read ||
    (userInfo.uid === uid && mode.owner.read) ||
    (userInfo.gid === gid && mode.group.read)
  );
};

const isWritable = (mode, uid: number, gid: number): boolean => {
  return (
    mode.others.write ||
    (userInfo.uid === uid && mode.owner.write) ||
    (userInfo.gid === gid && mode.group.write)
  );
};

const loadPath = (root: string): void => {
  const theWindow = globalThis.theWindow;
  fs.readdir(root, (err, names) => {
    if (err) {
      if (err.code === 'EACCES')
        theWindow?.webContents.send(Channels.error, err.message);
      theWindow?.webContents.send(Channels.fsLoadPathFailure, root);
      watcher.remove(root);
    } else {
      const children = names.map((name) => path.join(root, name));
      async.map(children, fs.lstat, (err, stats) => {
        theWindow?.webContents.send(
          Channels.fsLoadPathSuccess,
          root,
          names.map((name, ix) =>
            makeDescriptor(root, name, stats[ix] as fs.Stats)
          )
        );
        // NOTE: side-effect of makeDescriptor updates colors
        saveColors();
        watcher.add(root);
      });
    }
  });
};

const makeDescriptor = (
  root: string,
  name: string,
  stat: fs.Stats
): FileDescriptor => {
  const mode = Mode(stat);
  return {
    atime: new Date(stat.atime),
    btime: new Date(stat.birthtime),
    color: makeColor(name, stat),
    group: stat.gid,
    icon: makeIcon(name, stat),
    isDirectory: stat.isDirectory(),
    isExecutable: isExecutable(mode, stat.uid, stat.gid),
    isFile: stat.isFile(),
    isReadable: isReadable(mode, stat.uid, stat.gid),
    isSymlink: stat.isSymbolicLink(),
    isWritable: isWritable(mode, stat.uid, stat.gid),
    mode: mode.toString(),
    mtime: new Date(stat.mtime),
    name: name,
    path: path.join(root, name),
    size: stat.isFile() ? stat.size : 0,
    user:
      stat.uid === userInfo.uid
        ? userInfo.username
        : stat.uid === 0
        ? 'root'
        : String(stat.uid)
  };
};

watcher.on('change', (root: string) => loadPath(root));

watcher.on('fallback', (ulimit: number) => {
  const theWindow = globalThis.theWindow;
  const message = `Ran out of file handles after watching ${ulimit} files. Falling back to polling which uses more CPU. Run ulimit -n 10000 to increase the limit for open files`;
  theWindow?.webContents.send(Channels.error, message);
});

ipcMain.on(Channels.fsLoadPathRequest, (_, root: string): void =>
  loadPath(root)
);
