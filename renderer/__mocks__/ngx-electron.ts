import { Channels } from '../app/common';

import { on } from '../app/common';

export class MockElectronService {
  ipcRenderer = {
    on: jest.fn(on),
    send: jest.fn(),
    // NOTE: need to accomodate special @ngxs state persistence keys
    // this is just a catch-all implementation for the most commom
    // local storage access actions -- eq: state initialization
    sendSync: jest.fn((channel, arg) => {
      if (channel === Channels.fsHomeDir) return '/home/mflo';
      else if (channel === Channels.fsPathSeparator) return '/';
      else if (channel === Channels.fsRootDir) return '/';
      else if (
        channel === Channels.localStorageGetItem ||
        channel === Channels.localStorageKey
      )
        return arg?.startsWith?.('@ngxs.store') ? undefined : channel;
    })
  };
}
