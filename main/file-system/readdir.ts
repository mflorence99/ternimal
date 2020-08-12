import { Channels } from '../common/channels';
import { FileDescriptor } from '../common/file-system';

import { store } from '../local-storage';

import * as async from 'async';
import * as electron from 'electron';
import * as filewatcher from 'filewatcher';
import * as fs from 'fs';
import * as Mode from 'stat-mode';
import * as os from 'os';
import * as path from 'path';

const { ipcMain } = electron;

const userInfo = os.userInfo();
const watcher = filewatcher({ debounce: 250 });

const colorByExt = store.get('file-system.colorByExt', {});

const colors = [
  'var(--mat-amber-a100)',
  'var(--mat-blue-a100)',
  'var(--mat-cyan-a100)',
  'var(--mat-deep-orange-a100)',
  'var(--mat-deep-purple-a100)',
  'var(--mat-green-a100)',
  'var(--mat-indigo-a100)',
  'var(--mat-light-blue-a100)',
  'var(--mat-light-green-a100)',
  'var(--mat-lime-a100)',
  'var(--mat-orange-a100)',
  'var(--mat-pink-a100)',
  'var(--mat-purple-a100)',
  'var(--mat-red-a100)',
  'var(--mat-teal-a100)',
  'var(--mat-yellow-a100)'
];

const iconByExt = {
  '3g2': ['far', 'file-video'],
  '3gp': ['far', 'file-video'],
  '7z': ['far', 'file-archive'],
  'ai': ['far', 'file-image'],
  'aif': ['far', 'file-audio'],
  'apk': ['fas', 'cube'],
  'arj': ['far', 'file-archive'],
  'asm': ['far', 'file-code'],
  'asp': ['far', 'file-code'],
  'aspx': ['far', 'file-code'],
  'avi': ['far', 'file-video'],
  'bat': ['fas', 'microchip'],
  'bin': ['fas', 'cube'],
  'bmp': ['far', 'file-image'],
  'bz': ['far', 'file-archive'],
  'bz2': ['far', 'file-archive'],
  'c': ['far', 'file-code'],
  'cbl': ['far', 'file-code'],
  'cc': ['far', 'file-code'],
  'cda': ['far', 'file-audio'],
  'cfg': ['fas', 'cog'],
  'cfm': ['far', 'file-code'],
  'cgi': ['far', 'file-code'],
  'cmd': ['fas', 'microchip'],
  'com': ['fas', 'microchip'],
  'config': ['fas', 'cog'],
  'cpp': ['far', 'file-code'],
  'cson': ['far', 'file-code'],
  'css': ['fab', 'css3-alt'],
  'csv': ['far', 'file-excel'],
  'dat': ['fas', 'database'],
  'db': ['fas', 'database'],
  'dbf': ['fas', 'database'],
  'deb': ['far', 'file-archive'],
  'desktop': ['fas', 'cog'],
  'dmg': ['fas', 'cube'],
  'doc': ['far', 'file-word'],
  'docx': ['far', 'file-word'],
  'exe': ['fas', 'microchip'],
  'f': ['far', 'file-code'],
  'flv': ['far', 'file-video'],
  'fnt': ['fas', 'font'],
  'fon': ['fas', 'font'],
  'for': ['far', 'file-code'],
  'fs': ['far', 'file-code'],
  'gem': ['far', 'file-archive'],
  'gif': ['far', 'file-image'],
  'go': ['far', 'file-code'],
  'gradle': ['far', 'file-code'],
  'groovy': ['far', 'file-code'],
  'gz': ['far', 'file-archive'],
  'gzip': ['far', 'file-archive'],
  'h': ['far', 'file-code'],
  'h264': ['far', 'file-video'],
  'hh': ['far', 'file-code'],
  'htm': ['fab', 'html5'],
  'html': ['fab', 'html5'],
  'ico': ['far', 'file-image'],
  'ini': ['fas', 'cog'],
  'iso': ['fas', 'cube'],
  'jar': ['far', 'file-archive'],
  'java': ['fab', 'java'],
  'jpeg': ['far', 'file-image'],
  'jpg': ['far', 'file-image'],
  'js': ['fab', 'js'],
  'json': ['far', 'file-code'],
  'jsp': ['far', 'file-code'],
  'less': ['fab', 'less'],
  'log': ['fas', 'database'],
  'lua': ['far', 'file-code'],
  'm4v': ['far', 'file-video'],
  'mak': ['far', 'file-code'],
  'md': ['far', 'file-code'],
  'mdb': ['fas', 'database'],
  'mid': ['far', 'file-audio'],
  'midi': ['far', 'file-audio'],
  'mkv': ['far', 'file-video'],
  'mov': ['far', 'file-video'],
  'mp4': ['far', 'file-video'],
  'mpa': ['far', 'file-audio'],
  'mpeg': ['far', 'file-video'],
  'mpg': ['far', 'file-video'],
  'old': ['fas', 'database'],
  'ogg': ['far', 'file-audio'],
  'otf': ['fas', 'font'],
  'pdf': ['far', 'file-pdf'],
  'pkg': ['far', 'file-archive'],
  'pl': ['far', 'file-code'],
  'png': ['far', 'file-image'],
  'ppt': ['far', 'file-powerpoint'],
  'pptx': ['far', 'file-powerpoint'],
  'ps': ['far', 'file-image'],
  'psd': ['far', 'file-image'],
  'py': ['fab', 'python'],
  'rar': ['far', 'file-archive'],
  'rb': ['far', 'file-code'],
  'rc': ['far', 'file-code'],
  'rm': ['far', 'file-video'],
  'rpm': ['far', 'file-archive'],
  'sass': ['fab', 'sass'],
  'sav': ['fas', 'database'],
  'scss': ['fab', 'sass'],
  'sh': ['fas', 'microchip'],
  'so': ['fas', 'database'],
  'sql': ['fas', 'database'],
  'svg': ['far', 'file-image'],
  'swf': ['far', 'file-video'],
  'tar': ['far', 'file-archive'],
  'tcl': ['far', 'file-code'],
  'tif': ['far', 'file-image'],
  'tiff': ['far', 'file-image'],
  'toast': ['fas', 'cube'],
  'ts': ['far', 'file-code'],
  'ttf': ['fas', 'font'],
  'txt': ['far', 'file-alt'],
  'vb': ['far', 'file-code'],
  'vcd': ['fas', 'cube'],
  'vob': ['far', 'file-video'],
  'wav': ['far', 'file-audio'],
  'wma': ['far', 'file-audio'],
  'wmv': ['far', 'file-video'],
  'woff': ['fas', 'font'],
  'wpl': ['far', 'file-audio'],
  'wsf': ['fas', 'microchip'],
  'xhtml': ['fab', 'html5'],
  'xls': ['far', 'file-excel'],
  'xlsx': ['far', 'file-excel'],
  'xml': ['far', 'file-code'],
  'xsd': ['far', 'file-code'],
  'xz': ['far', 'file-archive'],
  'yaml': ['far', 'file-code'],
  'yml': ['far', 'file-code'],
  'z': ['far', 'file-archive'],
  'zip': ['far', 'file-archive'],
  'zzz': ['far', 'file']
};

const iconByName = {
  '.config': ['fas', 'cog'],
  '.dockerignore': ['fab', 'docker'],
  '.gitattributes': ['fab', 'github'],
  '.gitignore': ['fab', 'github'],
  '.gitconfig': ['fab', 'github'],
  '.npmignore': ['fab', 'node-js'],
  '.npmrc': ['fab', 'node-js'],
  'dockerfile': ['fab', 'docker']
};

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
          names.map((name, ix) => makeDescriptor(root, name, stats[ix]))
        );
        // NOTE: side-effect of makeDescriptor updates colorByExt
        store.set('file-system.colorByExt', colorByExt);
        watcher.add(root);
      });
    }
  });
};

const makeColor = (name: string, stat: fs.Stats): string => {
  if (stat.isDirectory()) return 'var(--mat-deep-orange-a100)';
  else if (stat.isFile()) {
    const ext = path.extname(name);
    if (!ext) return 'var(--mat-blue-grey-400)';
    else {
      const color =
        colorByExt[ext] ?? colors[Math.trunc(Math.random() * colors.length)];
      colorByExt[ext] = color;
      return color;
    }
  } else if (stat.isSymbolicLink()) return 'var(--mat-brown-400)';
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

const makeIcon = (name: string, stat: fs.Stats): string[] => {
  if (stat.isDirectory()) return ['fas', 'folder'];
  else if (stat.isFile()) {
    let icon = null;
    const ix = name.lastIndexOf('.');
    if (ix <= 0) icon = iconByName[name.toLowerCase()];
    else {
      const ext = name.substring(ix + 1).toLowerCase();
      icon = iconByExt[ext];
    }
    return icon ?? ['far', 'file'];
  } else if (stat.isSymbolicLink()) return ['fas', 'external-link-alt'];
  else return ['far', 'file'];
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
