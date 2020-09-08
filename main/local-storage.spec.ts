import { Channels } from './common';

import { on } from './common';
import { store } from './local-storage';

import 'jest-extended';

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
    on(Channels.localStorageClear)();
    expect(store.has('xxx')).toBeFalse();
  });

  test('localStorageGetItem', () => {
    store.set('xxx', 'yyy');
    on(Channels.localStorageGetItem)(event, 'xxx');
    expect(event.returnValue).toBe('yyy');
  });

  test('localStorageKey', () => {
    store.set('a', 1);
    store.set('b', 2);
    store.set('c', 3);
    on(Channels.localStorageKey)(event, 1);
    expect(event.returnValue).toBe('b');
  });

  test('localStorageRemoveItem', () => {
    store.set('a', 1);
    store.set('b', 2);
    store.set('c', 3);
    expect(store.has('b')).toBeTrue();
    on(Channels.localStorageRemoveItem)(event, 'b');
    expect(store.has('b')).toBe(false);
  });

  test('localStorageSetItem', () => {
    store.set('a', 1);
    store.set('c', 3);
    expect(store.has('b')).toBeFalse();
    on(Channels.localStorageSetItem)(event, 'b', 2);
    expect(store.get('b')).toBe(2);
  });
});
