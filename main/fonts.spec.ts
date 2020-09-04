import './fonts';

import { Channels } from './common';

import * as electron from 'electron';

// @see __mocks__/electron.ts

describe('fonts', () => {
  const event = {
    returnValue: null
  };

  beforeEach(() => {
    event.returnValue = null;
  });

  test('getAvailableFonts', async () => {
    const callbacks = electron['callbacks'];
    await callbacks[Channels.getAvailableFonts](event);
    expect(event.returnValue.length).toBeGreaterThan(1);
  });
});
