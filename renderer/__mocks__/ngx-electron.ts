import { on } from '../app/common';

export class MockElectronService {
  ipcRenderer = {
    on: jest.fn(on),
    send: jest.fn(),
    // NOTE: need to accomodate special @ngxs state persistence keys
    sendSync: jest.fn((channel, key) =>
      key?.startsWith?.('@ngxs.store') ? undefined : channel
    )
  };
}
