import './xterm-pty';

import { findCWD } from './xterm-pty';

import * as electron from 'electron';
import * as process from 'process';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

describe('xterm-pty', () => {
  let theWindow;

  beforeEach(() => {
    theWindow = new BrowserWindow({});
    globalThis.theWindow = theWindow;
  });

  test('findCWD', (done) => {
    findCWD(process.pid, (err, cwd) => {
      expect(err).toBeNull();
      expect(cwd).toEqual(process.cwd());
      done();
    });
  });
});
