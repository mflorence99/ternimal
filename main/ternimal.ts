import * as path from 'path';
import * as url from 'url';

import electron = require('electron');
import Store = require('electron-store');

const isDev = process.env['DEV_MODE'] === '1';
const store = new Store();
let theWindow = null;

electron.app.on('ready', () => {

  const bounds = store.get('theWindow.bounds', {
    height: 600,
    width: 800,
    x: undefined,
    y: undefined
  }) as electron.Rectangle;

  theWindow = new electron.BrowserWindow({
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

  if (isDev) {
    theWindow.loadURL(url.format({
      hostname: 'localhost',
      pathname: path.join(),
      port: 4200,
      protocol: 'http:',
      query: { isDev: true },
      slashes: true
    }));
    theWindow.webContents.openDevTools();
  } else {
    theWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  theWindow.setMenu(null);
  
  const setBounds = () =>
    store.set('theWindow.bounds', theWindow.getBounds());
  theWindow.on('move', setBounds);
  theWindow.on('resize', setBounds);

});

electron.app.on('window-all-closed', () => {
  electron.app.quit();
});
