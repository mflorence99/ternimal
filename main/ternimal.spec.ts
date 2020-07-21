/* eslint-disable @typescript-eslint/unbound-method */
import './ternimal';

import { Channels } from './common/channels';

import { store } from './local-storage';

import * as electron from 'electron';
import * as path from 'path';

describe('ternimal', () => {

  beforeEach(() => {
    const theWindow = electron['theWindow'];
    theWindow?.loadURL.mockReset();
    theWindow?.webContents.openDevTools.mockReset();
    theWindow?.webContents.reload.mockReset();
  });

  test('ready (dev mode)', () => {
    process.env['DEV_MODE'] = '1';
    const callbacks = electron['callbacks'];
    callbacks['ready']();
    const theWindow = electron['theWindow'];
    expect(theWindow.options.height).toBe(600);
    expect(theWindow.options.width).toBe(800);
    const call = (theWindow.loadURL as any).mock.calls[0];
    const url = call[0];
    expect(url).toBe('http://localhost:4200/.?isDev=true');
  });

  test('ready (prod mode)', () => {
    process.env['DEV_MODE'] = '0';
    const callbacks = electron['callbacks'];
    callbacks['ready']();
    const theWindow = electron['theWindow'];
    const call = (theWindow.loadURL as any).mock.calls[0];
    const url = call[0];
    expect(url).toBe(`file://${path.join(__dirname, 'index.html')}`);
  });

  test('ready (getBounds)', () => {
    process.env['DEV_MODE'] = '1';
    const callbacks = electron['callbacks'];
    callbacks['ready']();
    callbacks['move']();
    expect(store.get('theWindow.bounds')).toEqual({ x: 1, y: 2, width: 3, height: 4 });
  });

  test('window-all-closed', () => {
    const callbacks = electron['callbacks'];
    callbacks['window-all-closed']();
    expect(electron.app.quit).toHaveBeenCalled();
  });

  test('openDevTools', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.openDevTools]();
    const theWindow = electron['theWindow'];
    expect(theWindow.webContents.openDevTools).toHaveBeenCalled();
  });

  test('reload', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.reload]();
    const theWindow = electron['theWindow'];
    expect(theWindow.webContents.reload).toHaveBeenCalled();
  });

});
