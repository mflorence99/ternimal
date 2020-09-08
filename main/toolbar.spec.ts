import './toolbar';

import { Channels } from './common';

import { on } from './common';

import 'jest-extended';

import * as electron from 'electron';

// @see __mocks__/electron.ts

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

describe('toolbar', () => {
  let theWindow;

  beforeEach(() => {
    theWindow = new BrowserWindow({});
    globalThis.theWindow = theWindow;
  });

  test('openDevTools', () => {
    on(Channels.openDevTools)();
    expect(theWindow.webContents.openDevTools).toHaveBeenCalled();
  });

  test('reload', () => {
    on(Channels.reload)();
    expect(theWindow.webContents.reload).toHaveBeenCalled();
  });
});
