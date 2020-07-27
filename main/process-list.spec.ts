import './process-list';

import { Channels } from './common/channels';
import { ProcessList } from './common/process-list';

import * as electron from 'electron';

describe('process-list', () => {

  let event;

  beforeEach(() => {
    event = {
      reply: electron['createWaitableMock']()
    };
  });

  test('processListRequest', async() => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.processListRequest](event);
    await event.reply.waitToHaveBeenCalled(1);
    const call = event.reply.mock.calls[0];
    const processList: ProcessList = call[1];
    expect(processList.length).toBeGreaterThanOrEqual(1);
  });

});
