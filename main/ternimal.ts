import './file-system/chmod';
import './file-system/files';
import './file-system/paths';
import './file-system/readdir';
import './native';
import './process-list';
import './system-info';
import './toolbar';

import { store } from './local-storage';

import * as electron from 'electron';
import * as path from 'path';
import * as url from 'url';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { app, BrowserWindow } = electron;

let theWindow = null;

app.on('ready', () => {
  const isDev = process.env['DEV_MODE'] === '1';

  const bounds = store.get('theWindow.bounds', {
    height: 600,
    width: 800,
    x: undefined,
    y: undefined
  }) as electron.Rectangle;

  theWindow = new BrowserWindow({
    height: bounds.height,
    width: bounds.width,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      scrollBounce: true,
      webSecurity: !isDev
    },
    x: bounds.x,
    y: bounds.y
  });

  globalThis.theWindow = theWindow;

  if (isDev) {
    theWindow.loadURL(
      url.format({
        hostname: 'localhost',
        pathname: path.join(),
        port: 4200,
        protocol: 'http:',
        query: { isDev: true },
        slashes: true
      })
    );
    theWindow.webContents.openDevTools();
  } else {
    theWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  theWindow.setMenu(null);

  const setBounds = (): void =>
    store.set('theWindow.bounds', theWindow.getBounds());
  theWindow.on('move', setBounds);
  theWindow.on('resize', setBounds);
});

app.on('window-all-closed', () => {
  app.quit();
});
