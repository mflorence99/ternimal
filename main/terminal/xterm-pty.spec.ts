import './xterm-pty';

import { Channels } from '../common';

import { connected } from './xterm-pty';
import { findCWD } from './xterm-pty';
import { ptys } from './xterm-pty';
import { scrollbacks } from './xterm-pty';
import { xtermConnect } from './xterm-pty';
import { xtermDisconnect } from './xterm-pty';
import { xtermKill } from './xterm-pty';
import { xtermResizePty } from './xterm-pty';
import { xtermToPty } from './xterm-pty';

import * as electron from 'electron';
import * as process from 'process';

// @see __mocks__/electron.ts
// @see __mocks__/node-pty.ts

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

describe('xterm-pty', () => {
  let theWindow;

  beforeEach(() => {
    theWindow = new BrowserWindow({});
    globalThis.theWindow = theWindow;
    const callbacks = electron['callbacks'];
    callbacks['window-all-closed']();
  });

  test('findCWD', (done) => {
    findCWD(process.pid, (err, cwd) => {
      expect(err).toBeNull();
      expect(cwd).toEqual(process.cwd());
      done();
    });
  });

  test('xtermConnect', () => {
    // attempt connect
    xtermConnect(undefined, 'x', '/home');
    expect(connected.has('x')).toBe(true);
    const pty = ptys['x'];
    expect(pty).toBeTruthy();
    // generate 'xxx' data
    (pty.onData as any).mock.calls[0][0]('xxx');
    expect(theWindow.webContents.send).toHaveBeenCalledTimes(1);
    const calls = theWindow.webContents.send.mock.calls;
    expect(calls[0][0]).toEqual(Channels.xtermFromPty);
    expect(calls[0][1]).toEqual('x');
    expect(calls[0][2]).toEqual('xxx');
    // scrollbacks is whatever we just sent
    expect(scrollbacks['x'].toArray().join('')).toEqual('xxx');
    // connect again and we'll receive the scrollback data
    xtermConnect(undefined, 'x', '/home');
    expect(theWindow.webContents.send).toHaveBeenCalledTimes(2);
    expect(calls[1][0]).toEqual(Channels.xtermFromPty);
    expect(calls[1][1]).toEqual('x');
    expect(calls[1][2]).toEqual('xxx');
  });

  test('xtermDisconnect', () => {
    xtermConnect(undefined, 'x', '/home');
    expect(connected.has('x')).toBe(true);
    xtermDisconnect(undefined, 'x');
    expect(connected.has('x')).toBe(false);
  });

  test('xtermKill', () => {
    xtermConnect(undefined, 'x', '/home');
    expect(connected.has('x')).toBe(true);
    const pty = ptys['x'];
    expect(ptys['x']).toBeTruthy();
    xtermKill(undefined, 'x');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(pty.kill).toHaveBeenCalled();
    expect(connected.has('x')).toBe(false);
    expect(ptys['x']).toBeFalsy();
  });

  test('xtermResizePty', () => {
    xtermConnect(undefined, 'x', '/home');
    const pty = ptys['x'];
    xtermResizePty(undefined, 'x', 80, 40);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(pty.resize).toHaveBeenCalled();
    const calls = (pty.resize as any).mock.calls;
    expect(calls[0][0]).toEqual(80);
    expect(calls[0][1]).toEqual(40);
  });

  test('xtermResizePty', () => {
    xtermConnect(undefined, 'x', '/home');
    const pty = ptys['x'];
    xtermToPty(undefined, 'x', 'xxx');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(pty.write).toHaveBeenCalled();
    const calls = (pty.write as any).mock.calls;
    expect(calls[0][0]).toEqual('xxx');
  });
});
