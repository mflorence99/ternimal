import { Channels } from './common';

import * as electron from 'electron';

import Store = require('electron-store');

const { ipcMain } = electron;

/* eslint-enable @typescript-eslint/naming-convention */
const isDev = process.env['DEV_MODE'] === '1';

export const store = new Store({
  name: isDev ? 'config.dev' : 'config.prod'
});

ipcMain.on(Channels.localStorageClear, (): void => {
  store.clear();
});

ipcMain.on(Channels.localStorageGetItem, (event: Event, key: string): void => {
  event.returnValue = store.get(key) as any;
});

ipcMain.on(Channels.localStorageKey, (event: Event, n: number): void => {
  event.returnValue = Object.keys(store.store)[n] as any;
});

ipcMain.on(
  Channels.localStorageRemoveItem,
  (event: Event, key: string): void => {
    store.delete(key);
  }
);

ipcMain.on(
  Channels.localStorageSetItem,
  (event: Event, key: string, value: any): void => {
    store.set(key, value);
  }
);
