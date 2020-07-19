/* eslint-disable @typescript-eslint/unbound-method */
import './ternimal';

import { theWindow } from './ternimal';

import * as electron from 'electron';

describe('ternimal', () => {

  test('ready (dev mode)', () => {
    process.env['DEV_MODE'] = '1';
    const callbacks = electron['callbacks'];
    callbacks['ready']();
    expect(theWindow.options.height).toBe(600);
    expect(theWindow.options.width).toBe(800);
    expect(theWindow.loadURL).toHaveBeenCalled();
  });

  test('ready (prod mode)', () => {
    process.env['DEV_MODE'] = '0';
    const callbacks = electron['callbacks'];
    callbacks['ready']();
    expect(theWindow.loadURL).toHaveBeenCalled();
  });

  test('window-all-closed', () => {
    const callbacks = electron['callbacks'];
    callbacks['window-all-closed']();
    expect(electron.app.quit).toHaveBeenCalled();
  });

});
