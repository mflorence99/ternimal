import './long-running-op';

import { Channels } from './common';

import { isLongRunningOpCanceled } from './long-running-op';
import { on } from './common';

import 'jest-extended';

// @see __mocks__/electron.ts

describe('long-running-op', () => {
  test('longRunningOpCancel', () => {
    on(Channels.longRunningOpCancel)(undefined, 'xxx');
    expect(() => isLongRunningOpCanceled('xxx', 'yyy')).toThrowWithMessage(
      Error,
      'yyy'
    );
  });
});
