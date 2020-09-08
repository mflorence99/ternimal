import './native';

import { Channels } from './common';

import { on } from './common';

import 'jest-extended';

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
    on(Channels.nativeClipboardClear)();
    expect(clipboard.readText()).toBeNil();
  });

  test('nativeClipboardRead', () => {
    clipboard.writeText('xxx');
    on(Channels.nativeClipboardRead)(event);
    expect(event.returnValue).toBe('xxx');
  });

  test('nativeClipboardWrite', () => {
    on(Channels.nativeClipboardWrite)(event, 'xxx');
    expect(clipboard.readText()).toBe('xxx');
  });

  test('nativeDragStart', async () => {
    await on(Channels.nativeDragStart)(event, __filename);
    expect(event.sender.startDrag).toHaveBeenCalledWith(
      expect.objectContaining({
        file: __filename
      })
    );
  });

  test('nativeOpen', () => {
    on(Channels.nativeOpen)(event, __filename);
    expect(opener).toHaveBeenCalledWith(__filename);
  });
});
