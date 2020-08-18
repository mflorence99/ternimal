import './process-list';

import { Channels } from './common';
import { ProcessList } from './common';

import { waitableJestFn } from './main.spec';

import * as electron from 'electron';

describe('process-list', () => {
  let event;

  beforeEach(() => {
    event = {
      reply: waitableJestFn()
    };
  });

  test('processListRequest', async () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.processListRequest](event);
    await event.reply.waitUntilComplete();
    const call = event.reply.mock.calls[0];
    const processList: ProcessList = call[1];
    expect(processList.length).toBeGreaterThanOrEqual(1);
  });
});
