import './toolbar';

import { Channels } from './common/channels';

import * as electron from 'electron';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

describe('toolbar', () => {

  let theWindow;

  beforeEach(() => {
    theWindow = new BrowserWindow({ });
    globalThis.theWindow = theWindow;
  });

  test('openDevTools', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.openDevTools]();
    expect(theWindow.webContents.openDevTools).toHaveBeenCalled();
  });

  test('reload', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.reload]();
    expect(theWindow.webContents.reload).toHaveBeenCalled();
  });

});
