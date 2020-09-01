import { Channels } from '../common';

import { cwdDebounceTimeout } from '../common';
import { maxScrollback } from '../common';

import * as child_process from 'child_process';
import * as electron from 'electron';
import * as fs from 'fs';
import * as os from 'os';
import * as process from 'process';

import { debounce } from 'debounce';

import nodePty = require('node-pty');
import CBuffer = require('CBuffer');

const { app, ipcMain } = electron;

// node-pty is not yet context aware
app.allowRendererProcessReuse = false;

export const connected = new Set<string>();
export const ptys: Record<string, nodePty.IPty> = {};
export const scrollbacks: Record<string, typeof CBuffer> = {};

// @see https://stackoverflow.com/questions/15939380/
export const findCWD = debounce((pid: number, callback): void => {
  switch (os.type()) {
    case 'Linux':
      fs.readlink(`/proc/${pid}/cwd`, callback);
      break;
    case 'Darwin':
      child_process.exec(
        `lsof -a -d cwd -p ${pid} | tail -1 | awk '{print $9}'`,
        callback
      );
      break;
    default:
      callback('unsupported OS', null);
  }
}, cwdDebounceTimeout);

export const xtermConnect = (_, id: string, cwd: string): void => {
  const theWindow = globalThis.theWindow;
  let pty = ptys[id];
  if (!pty) {
    // no pty session yet
    const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
    pty = nodePty.spawn(shell, [], {
      cwd: cwd,
      env: process.env,
      name: 'xterm-256color'
    });
    // register new connection
    connected.add(id);
    ptys[id] = pty;
    scrollbacks[id] = new CBuffer(maxScrollback);
    // route data to xterm while still connected
    let prevCWD: string = null;
    pty.onData((data: string): void => {
      if (connected.has(id))
        theWindow?.webContents.send(Channels.xtermFromPty, id, data);
      scrollbacks[id].push(data);
      // look for a change in the pty session's CWD
      findCWD(pty.pid, (err, cwd) => {
        if (!err && cwd !== prevCWD) {
          theWindow?.webContents.send(Channels.xtermCWD, id, cwd);
          prevCWD = cwd;
        }
      });
    });
  } else {
    // reattach to pty session
    connected.add(id);
    const scrollback = scrollbacks[id].toArray().join('');
    theWindow?.webContents.send(Channels.xtermFromPty, id, scrollback);
  }
};

export const xtermDisconnect = (_, id: string): void => {
  connected.delete(id);
};

export const xtermKill = (_, id: string): void => {
  xtermDisconnect(_, id);
  ptys[id]?.kill();
  delete ptys[id];
  delete scrollbacks[id];
};

export const xtermResizePty = (
  _,
  id: string,
  cols: number,
  rows: number
): void => {
  ptys[id]?.resize(cols, rows);
};

export const xtermToPty = (_, id: string, data: string): void => {
  ptys[id]?.write(data);
};

app.on('window-all-closed', () => {
  Object.keys(ptys).forEach((id) => xtermKill(undefined, id));
});

ipcMain.on(Channels.xtermConnect, xtermConnect);

ipcMain.on(Channels.xtermDisconnect, xtermDisconnect);

ipcMain.on(Channels.xtermKill, xtermKill);

ipcMain.on(Channels.xtermResizePty, xtermResizePty);

ipcMain.on(Channels.xtermToPty, xtermToPty);

ipcMain.on(Channels.xtermResizePty, xtermResizePty);
