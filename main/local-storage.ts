/* eslint-disable @typescript-eslint/naming-convention */
const { Channels } = require('./common/channels');
const { ipcMain, Event } = require('electron');

/* eslint-enable @typescript-eslint/naming-convention */
const isDev = process.env['DEV_MODE'] === '1';

// eslint-disable-next-line @typescript-eslint/naming-convention
const Store = require('electron-store');

const store = new Store({
  name: isDev ? 'config.dev' : 'config.prod'
});

ipcMain.on(Channels.localStorageClear, (): void => {
  store.clear();
});

ipcMain.on(Channels.localStorageGetItem, (event: typeof Event, key: string): void => {
  event.returnValue = store.get(key);
});

ipcMain.on(Channels.localStorageKey, (event: typeof Event, n: number): void => {
  event.returnValue = Object.keys(store.store)[n];
});

ipcMain.on(Channels.localStorageRemoveItem, (event: typeof Event, key: string): void => {
  store.delete(key);
});

ipcMain.on(Channels.localStorageSetItem, (event: typeof Event, key: string, value: any): void => {
  store.set(key, value);
});

export = store;
