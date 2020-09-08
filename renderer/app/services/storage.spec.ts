/* eslint-disable @typescript-eslint/unbound-method */
import { Channels } from '../common';
import { StorageService } from './storage';

import { prepare } from './services.spec';

import 'jest-extended';

import { TestBed } from '@angular/core/testing';

// @see __mocks__/ngx-electron.ts

describe('StorageService', () => {
  let sender: Function, syncSender: Function;
  let storage: StorageService;

  beforeEach(() => {
    prepare();
    storage = TestBed.inject(StorageService);
    sender = storage.electron.ipcRenderer.send;
    syncSender = storage.electron.ipcRenderer.sendSync;
  });

  test('clear', () => {
    storage.clear();
    expect(sender).toHaveBeenCalledWith(Channels.localStorageClear);
  });

  test('getItem', () => {
    expect(storage.getItem('xxx')).toEqual(Channels.localStorageGetItem);
    expect(syncSender).toHaveBeenCalledWith(
      Channels.localStorageGetItem,
      'xxx'
    );
  });

  test('key', () => {
    expect(storage.key(5)).toEqual(Channels.localStorageKey);
    expect(syncSender).toHaveBeenCalledWith(Channels.localStorageKey, 5);
  });

  test('removeItem', () => {
    storage.removeItem('xxx');
    expect(sender).toHaveBeenCalledWith(Channels.localStorageRemoveItem, 'xxx');
  });

  test('setItem', () => {
    storage.setItem('xxx', 'yyy');
    expect(sender).toHaveBeenCalledWith(
      Channels.localStorageSetItem,
      'xxx',
      'yyy'
    );
  });
});
