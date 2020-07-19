import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ElectronService {

  ipcRenderer = {
    send: jest.fn(),
    sendSync: jest.fn(channel => channel)
  };

}
