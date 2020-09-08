import './xterm-pty';

import { Channels } from '../common';

import { connected } from './xterm-pty';
import { cwdDebounceTimeout } from '../common';
import { findCWD } from './xterm-pty';
import { on } from '../common';
import { ptys } from './xterm-pty';
import { scrollbacks } from './xterm-pty';
import { xtermConnect } from './xterm-pty';
import { xtermDisconnect } from './xterm-pty';
import { xtermKill } from './xterm-pty';
import { xtermResizePty } from './xterm-pty';
import { xtermToPty } from './xterm-pty';

import 'jest-extended';

import * as electron from 'electron';
import * as process from 'process';

// @see __mocks__/electron.ts
// @see __mocks__/node-pty.ts

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

describe('xterm-pty', () => {
  const onData = (pty): Function => pty.onData.mock.calls[0][0];
  let theWindow;

  beforeEach(() => {
    theWindow = new BrowserWindow({});
    globalThis.theWindow = theWindow;
    on('window-all-closed')();
  });

  test('findCWD - Linux', (done) => {
    findCWD(process.pid, 'linux', (err, cwd) => {
      expect(err).toBeNull();
      expect(cwd).toEqual(process.cwd());
      done();
    });
  });

  test('findCWD - MacOS', (done) => {
    findCWD(process.pid, 'darwin', (err, cwd) => {
      expect(err).toBeNull();
      expect(cwd).toBeTruthy();
      done();
    });
  });

  test('findCWD - Windows', (done) => {
    findCWD(process.pid, 'win32', (err, cwd) => {
      expect(err).toBe('Unsupported OS');
      expect(cwd).toBeNull();
      done();
    });
  });

  test('xtermConnect', () => {
    // attempt connect
    xtermConnect(undefined, 'x', '/home');
    expect(connected.has('x')).toBeTrue();
    const pty = ptys['x'];
    expect(pty).toBeTruthy();
    // generate 'xxx' data
    onData(pty)('xxx');
    expect(theWindow.webContents.send).toHaveBeenNthCalledWith(
      1,
      Channels.xtermFromPty,
      'x',
      'xxx'
    );
    // scrollbacks is whatever we just sent
    expect(scrollbacks['x'].toArray().join('')).toBe('xxx');
    // connect again and we'll receive the scrollback data
    xtermConnect(undefined, 'x', '/home');
    expect(theWindow.webContents.send).toHaveBeenNthCalledWith(
      2,
      Channels.xtermFromPty,
      'x',
      'xxx'
    );
  });

  test('xtermConnect - detect CWD', (done) => {
    xtermConnect(undefined, 'x', '/home');
    // trigger change in CWD
    const pty = ptys['x'];
    onData(pty)(`cd ${__dirname}`);
    // NOTE: this sucks, but any other way is way too complicated
    // and for little reward
    setTimeout(() => {
      expect(theWindow.webContents.send).toHaveBeenCalledTimes(2);
      done();
    }, cwdDebounceTimeout + 100);
  });

  test('xtermDisconnect', () => {
    xtermConnect(undefined, 'x', '/home');
    expect(connected.has('x')).toBeTrue();
    xtermDisconnect(undefined, 'x');
    expect(connected.has('x')).toBeFalse();
  });

  test('xtermKill', () => {
    xtermConnect(undefined, 'x', '/home');
    expect(connected.has('x')).toBeTrue();
    const pty = ptys['x'];
    expect(ptys['x']).toBeTruthy();
    xtermKill(undefined, 'x');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(pty.kill).toHaveBeenCalled();
    expect(connected.has('x')).toBeFalse();
    expect(ptys['x']).toBeUndefined();
  });

  test('xtermResizePty', () => {
    xtermConnect(undefined, 'x', '/home');
    const pty = ptys['x'];
    xtermResizePty(undefined, 'x', 80, 40);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(pty.resize).toHaveBeenCalledWith(80, 40);
  });

  test('xtermToPty', () => {
    xtermConnect(undefined, 'x', '/home');
    const pty = ptys['x'];
    xtermToPty(undefined, 'x', 'xxx');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(pty.write).toHaveBeenCalledWith('xxx');
  });
});
