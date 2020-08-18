import './system-info';

import { Channels } from './common';
import { SystemInfo } from './common';

import * as electron from 'electron';

describe('system-info', () => {
  let event;

  beforeEach(() => {
    event = {
      returnValue: null
    };
  });

  test('systemInfo', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.systemInfo](event);
    const systemInfo: SystemInfo = event.returnValue;
    expect(systemInfo.cpuUsage).toBeGreaterThanOrEqual(0);
    expect(systemInfo.memUsage).toBeGreaterThanOrEqual(0);
  });
});
