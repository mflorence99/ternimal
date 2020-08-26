import { Channels } from './common';

import { maxScrollback } from './common';

import * as CBuffer from 'CBuffer';
import * as electron from 'electron';
import * as nodePty from 'node-pty';
import * as os from 'os';
import * as process from 'process';

const { app, ipcMain } = electron;

// node-pty is not yet context aware
app.allowRendererProcessReuse = false;

const connected = new Set<string>();
const ptys: Record<string, nodePty.IPty> = {};
const scrollbacks: Record<string, typeof CBuffer> = {};

const connect = (id: string): void => {
  connected.add(id);
  const theWindow = globalThis.theWindow;
  let pty = ptys[id];
  if (!pty) {
    scrollbacks[id] = new CBuffer(maxScrollback);
    const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
    pty = nodePty.spawn(shell, [], {
      cwd: app.getPath('home'),
      env: process.env,
      name: 'xterm-256color'
    });
    pty.onData((data: string): void => {
      if (connected.has(id))
        theWindow?.webContents.send(Channels.xtermFromPty, id, data);
      scrollbacks[id].push(data);
    });
    ptys[id] = pty;
  } else {
    const scrollback = scrollbacks[id].toArray().join('');
    theWindow?.webContents.send(Channels.xtermFromPty, id, scrollback);
  }
};

const disconnect = (id: string): void => {
  connected.delete(id);
};

const kill = (id: string): void => {
  const pty = ptys[id];
  if (pty) {
    pty.kill();
    delete ptys[id];
  }
};

const resize = (id: string, cols: number, rows: number): void => {
  const pty = ptys[id];
  if (pty) pty.resize(cols, rows);
};

const write = (id: string, data: string): void => {
  const pty = ptys[id];
  if (pty) pty.write(data);
};

app.on('window-all-closed', () => {
  Object.keys(ptys).forEach((id) => kill(id));
});

ipcMain.on(Channels.xtermConnect, (_, id: string): void => {
  connect(id);
});

ipcMain.on(Channels.xtermDisconnect, (_, id: string): void => {
  disconnect(id);
});

ipcMain.on(Channels.xtermKill, (_, id: string): void => {
  kill(id);
});

ipcMain.on(Channels.xtermToPty, (_, id: string, data: string): void => {
  write(id, data);
});

ipcMain.on(
  Channels.xtermResizePty,
  (_, id: string, cols: number, rows: number): void => {
    resize(id, cols, rows);
  }
);
