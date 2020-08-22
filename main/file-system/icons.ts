import { store } from '../local-storage';

import * as fs from 'fs-extra';
import * as path from 'path';

const colorByExt = store.get('file-system.colorByExt', {});

const colors = [
  'var(--google-blue-300)',
  'var(--google-blue-500)',
  'var(--google-blue-700)',
  'var(--google-green-300)',
  'var(--google-green-500)',
  'var(--google-green-700)',
  'var(--google-red-300)',
  'var(--google-red-500)',
  'var(--google-red-700)',
  'var(--google-yellow-300)',
  'var(--google-yellow-500)',
  'var(--google-yellow-700)',
  'var(--mat-amber-300)',
  'var(--mat-amber-500)',
  'var(--mat-amber-700)',
  'var(--mat-blue-300)',
  'var(--mat-blue-500)',
  'var(--mat-blue-700)',
  'var(--mat-blue-grey-300)',
  'var(--mat-blue-grey-400)',
  'var(--mat-blue-grey-500)',
  'var(--mat-brown-300)',
  'var(--mat-brown-500)',
  'var(--mat-brown-700)',
  'var(--mat-cyan-300)',
  'var(--mat-cyan-500)',
  'var(--mat-cyan-700)',
  'var(--mat-deep-orange-300)',
  'var(--mat-deep-orange-500)',
  'var(--mat-deep-orange-700)',
  'var(--mat-green-300)',
  'var(--mat-green-500)',
  'var(--mat-green-700)',
  'var(--mat-indigo-300)',
  'var(--mat-indigo-500)',
  'var(--mat-indigo-700)',
  'var(--mat-light-blue-300)',
  'var(--mat-light-blue-500)',
  'var(--mat-light-blue-700)',
  'var(--mat-light-green-300)',
  'var(--mat-light-green-500)',
  'var(--mat-light-green-700)',
  'var(--mat-lime-300)',
  'var(--mat-lime-500)',
  'var(--mat-lime-700)',
  'var(--mat-orange-300)',
  'var(--mat-orange-500)',
  'var(--mat-orange-700)',
  'var(--mat-pink-300)',
  'var(--mat-pink-500)',
  'var(--mat-pink-700)',
  'var(--mat-purple-300)',
  'var(--mat-purple-500)',
  'var(--mat-purple-700)',
  'var(--mat-red-300)',
  'var(--mat-red-500)',
  'var(--mat-red-700)',
  'var(--mat-teal-300)',
  'var(--mat-teal-500)',
  'var(--mat-teal-700)',
  'var(--mat-yellow-300)',
  'var(--mat-yellow-500)',
  'var(--mat-yellow-700)'
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

export const makeColor = (name: string, stat: fs.Stats): string => {
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

export const makeIcon = (name: string, stat: fs.Stats): string[] => {
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

export const saveColors = (): void => {
  store.set('file-system.colorByExt', colorByExt);
};
