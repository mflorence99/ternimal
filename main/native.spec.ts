import './native';

import { Channels } from './common';

import * as electron from 'electron';

import opener = require('opener');

// @see __mocks__/electron.ts
// @see __mocks__/electron-clipboard.ts
// @see __mocks__/opener.ts

const { clipboard } = electron;

describe('native', () => {
  const event = {
    returnValue: null,
    sender: {
      startDrag: jest.fn()
    }
  };

  beforeEach(() => {
    event.sender.startDrag.mockReset();
    event.returnValue = null;
    clipboard.clear();
  });

  test('nativeClipboardClear', () => {
    clipboard.writeText('xxx');
    expect(clipboard.readText()).toBe('xxx');
    const callbacks = electron['callbacks'];
    callbacks[Channels.nativeClipboardClear]();
    expect(clipboard.readText()).toBe(null);
  });

  test('nativeClipboardRead', () => {
    clipboard.writeText('xxx');
    const callbacks = electron['callbacks'];
    callbacks[Channels.nativeClipboardRead](event);
    expect(event.returnValue).toBe('xxx');
  });

  test('nativeClipboardWrite', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.nativeClipboardWrite](event, 'xxx');
    expect(clipboard.readText()).toBe('xxx');
  });

  test('nativeDragStart', async () => {
    const callbacks = electron['callbacks'];
    await callbacks[Channels.nativeDragStart](event, __filename);
    expect(event.sender.startDrag).toHaveBeenCalled();
    const { file } = event.sender.startDrag.mock.calls[0][0];
    expect(file).toEqual(__filename);
  });

  test('nativeOpen', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.nativeOpen](event, __filename);
    const path = (opener as any).mock.calls[0][0];
    expect(path).toEqual(__filename);
  });
});
