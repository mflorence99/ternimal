import { Channels } from './channels';

describe('channels', () => {
  test('enums', () => {
    expect(Channels.localStorageClear).toEqual('local-storage.clear');
  });
});
