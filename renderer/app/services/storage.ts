import { Channels } from '../common/channels';

import { ElectronService } from 'ngx-electron';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService implements Storage {

  length = 0;

  constructor(public electron: ElectronService) { }

  // @see https://developer.mozilla.org/en-US/docs/Web/API/Storage

  clear(): void {
    this.electron.ipcRenderer.send(Channels.localStorageClear);
  }

  getItem(key: string): any {
    return this.electron.ipcRenderer.sendSync(Channels.localStorageGetItem, key);
  }

  key(n: number): string {
    return this.electron.ipcRenderer.sendSync(Channels.localStorageKey, n);
  }

  removeItem(key: string): void {
    this.electron.ipcRenderer.send(Channels.localStorageRemoveItem, key);
  }

  setItem(key: string, value: any): void {
    this.electron.ipcRenderer.send(Channels.localStorageSetItem, key, value);
  }

}
