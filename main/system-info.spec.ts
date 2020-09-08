import './system-info';

import { Channels } from './common';

import { on } from './common';

import 'jest-extended';

// @see __mocks__/electron.ts

describe('system-info', () => {
  const event = {
    returnValue: null
  };

  beforeEach(() => {
    event.returnValue = null;
  });

  test('systemInfo', () => {
    on(Channels.systemInfo)(event);
    expect(event.returnValue).toEqual(
      expect.objectContaining({
        cpuUsage: expect.any(Number),
        memUsage: expect.any(Number)
      })
    );
  });
});
