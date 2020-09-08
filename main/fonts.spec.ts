import './fonts';

import { Channels } from './common';

import { on } from './common';

import 'jest-extended';

// @see __mocks__/electron.ts

describe('fonts', () => {
  const event = {
    returnValue: null
  };

  beforeEach(() => {
    event.returnValue = null;
  });

  test('getAvailableFonts', async () => {
    await on(Channels.getAvailableFonts)(event);
    expect(event.returnValue).toBeArray();
  });
});
