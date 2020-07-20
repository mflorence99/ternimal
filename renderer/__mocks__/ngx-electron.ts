import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ElectronService {

  ipcRenderer = {
    send: jest.fn(),
    // NOTE: need to accomodate special @ngxs state persistence keys
    sendSync: jest.fn((channel, key) => key?.startsWith?.('@ngxs.store') ? null :  channel)
  };

}
