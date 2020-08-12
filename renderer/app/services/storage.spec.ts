/* eslint-disable @typescript-eslint/unbound-method */
import { Channels } from '../common/channels';
import { StorageService } from './storage';

import { TestBed } from '@angular/core/testing';

// @see __mocks__/ngx-electron.ts

describe('StorageService', () => {
  let storage: StorageService;

  beforeEach(() => {
    storage = TestBed.inject(StorageService);
  });

  test('clear', () => {
    storage.clear();
    expect(storage.electron.ipcRenderer.send).toHaveBeenCalled();
    const call = (storage.electron.ipcRenderer.send as any).mock.calls[0];
    const channel = call[0];
    expect(channel).toEqual(Channels.localStorageClear);
  });

  test('getItem', () => {
    const item = storage.getItem('xxx');
    expect(storage.electron.ipcRenderer.sendSync).toHaveBeenCalled();
    const call = (storage.electron.ipcRenderer.sendSync as any).mock.calls[0];
    const channel = call[0];
    const key = call[1];
    expect(channel).toEqual(Channels.localStorageGetItem);
    expect(key).toBe('xxx');
    expect(item).toEqual(Channels.localStorageGetItem);
  });

  test('key', () => {
    const key = storage.key(5);
    expect(storage.electron.ipcRenderer.sendSync).toHaveBeenCalled();
    const call = (storage.electron.ipcRenderer.sendSync as any).mock.calls[0];
    const channel = call[0];
    const n = call[1];
    expect(channel).toEqual(Channels.localStorageKey);
    expect(n).toBe(5);
    expect(key).toEqual(Channels.localStorageKey);
  });

  test('removeItem', () => {
    storage.removeItem('xxx');
    expect(storage.electron.ipcRenderer.send).toHaveBeenCalled();
    const call = (storage.electron.ipcRenderer.send as any).mock.calls[0];
    const channel = call[0];
    const key = call[1];
    expect(channel).toEqual(Channels.localStorageRemoveItem);
    expect(key).toBe('xxx');
  });

  test('setItem', () => {
    storage.setItem('xxx', 'yyy');
    expect(storage.electron.ipcRenderer.send).toHaveBeenCalled();
    const call = (storage.electron.ipcRenderer.send as any).mock.calls[0];
    const channel = call[0];
    const key = call[1];
    const value = call[2];
    expect(channel).toEqual(Channels.localStorageSetItem);
    expect(key).toBe('xxx');
    expect(value).toBe('yyy');
  });
});
