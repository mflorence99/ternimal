/* eslint-disable @typescript-eslint/unbound-method */
import './ternimal';

import { on } from './common';
import { store } from './local-storage';

import * as electron from 'electron';
import * as path from 'path';

// @see __mocks__/electron.ts

describe('ternimal', () => {
  // NOTE: afterEach in this special case because theWindow isn't created
  // until ready is called
  afterEach(() => {
    const theWindow = globalThis.theWindow;
    theWindow.loadURL.mockReset();
    theWindow.webContents.openDevTools.mockReset();
    theWindow.webContents.reload.mockReset();
  });

  test('ready (dev mode)', () => {
    process.env['DEV_MODE'] = '1';
    on('ready')();
    const theWindow = globalThis.theWindow;
    expect(theWindow.options).toEqual(
      expect.objectContaining({
        height: 600,
        width: 800
      })
    );
    expect(theWindow.loadURL).toHaveBeenLastCalledWith(
      'http://localhost:4200/.?isDev=true'
    );
  });

  test('ready (prod mode)', () => {
    process.env['DEV_MODE'] = '0';
    on('ready')();
    const theWindow = globalThis.theWindow;
    expect(theWindow.loadURL).toHaveBeenLastCalledWith(
      `file://${path.join(__dirname, '..', 'renderer', 'index.html')}`
    );
  });

  test('ready (getBounds)', () => {
    process.env['DEV_MODE'] = '1';
    on('ready')();
    on('move')();
    expect(store.get('theWindow.bounds')).toEqual({
      x: 1,
      y: 2,
      width: 3,
      height: 4
    });
  });

  test('window-all-closed', () => {
    on('window-all-closed')();
    expect(electron.app.quit).toHaveBeenCalled();
  });
});
