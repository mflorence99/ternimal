import './long-running-op';

import { Channels } from './common';

import { isLongRunningOpCanceled } from './long-running-op';

import * as electron from 'electron';

// @see __mocks__/electron.s

describe('long-running-op', () => {
  test('longRunningOpCancel', () => {});
  const callbacks = electron['callbacks'];
  callbacks[Channels.longRunningOpCancel](undefined, 'xxx');
  // @see https://stackoverflow.com/questions/46042613/
  expect.assertions(1);
  try {
    isLongRunningOpCanceled('xxx', 'yyy');
  } catch (error) {
    expect(error.message).toEqual('yyy');
  }
});
