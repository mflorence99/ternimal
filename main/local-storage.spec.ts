import { Channels } from './common';

import { store } from './local-storage';

import * as electron from 'electron';

// @see __mocks__/electron.ts
// @see __mocks__/electron-store.ts

describe('local-storage', () => {
  const event = {
    returnValue: null
  };

  beforeEach(() => {
    event.returnValue = null;
    store.clear();
  });

  test('smoke test', () => {
    expect(store['options']).toEqual({ name: 'config.prod' });
  });

  test('localStorageClear', () => {
    store.set('xxx', 'yyy');
    expect(store.get('xxx')).toBe('yyy');
    const callbacks = electron['callbacks'];
    callbacks[Channels.localStorageClear]();
    expect(store.has('xxx')).toBe(false);
  });

  test('localStorageGetItem', () => {
    store.set('xxx', 'yyy');
    const callbacks = electron['callbacks'];
    callbacks[Channels.localStorageGetItem](event, 'xxx');
    expect(event.returnValue).toEqual('yyy');
  });

  test('localStorageKey', () => {
    store.set('a', 1);
    store.set('b', 2);
    store.set('c', 3);
    const callbacks = electron['callbacks'];
    callbacks[Channels.localStorageKey](event, 1);
    expect(event.returnValue).toEqual('b');
  });

  test('localStorageRemoveItem', () => {
    store.set('a', 1);
    store.set('b', 2);
    store.set('c', 3);
    expect(store.has('b')).toBe(true);
    const callbacks = electron['callbacks'];
    callbacks[Channels.localStorageRemoveItem](event, 'b');
    expect(store.has('b')).toBe(false);
  });

  test('localStorageSetItem', () => {
    store.set('a', 1);
    store.set('c', 3);
    expect(store.has('b')).toBe(false);
    const callbacks = electron['callbacks'];
    callbacks[Channels.localStorageSetItem](event, 'b', 2);
    expect(store.get('b')).toBe(2);
  });
});
