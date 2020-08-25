import { Channels } from './common';

import * as electron from 'electron';
import * as nodePty from 'node-pty';
import * as os from 'os';
import * as process from 'process';

const { app, ipcMain } = electron;

// node-pty is not yet context aware
app.allowRendererProcessReuse = false;

const ptys: Record<string, nodePty.IPty> = {};

const connect = (id: string): void => {
  let pty = ptys[id];
  if (!pty) {
    const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
    pty = nodePty.spawn(shell, [], {
      cwd: app.getPath('home'),
      env: process.env,
      name: 'xterm-256color'
    });
    pty.onData((data: string): void => {
      const theWindow = globalThis.theWindow;
      theWindow?.webContents.send(Channels.xtermFromPty + id, data);
    });
    ptys[id] = pty;
  }
  console.log(id);
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

ipcMain.on(Channels.xtermToPty, (_, id: string, data: string): void => {
  write(id, data);
});

ipcMain.on(Channels.xtermKill, (_, id: string): void => {
  kill(id);
});

ipcMain.on(
  Channels.xtermResizePty,
  (_, id: string, cols: number, rows: number): void => {
    resize(id, cols, rows);
  }
);
