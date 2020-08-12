import { Bundle } from '../state.spec';
import { FileSystemClipboardState } from './clipboard';

import { prepare } from '../state.spec';

describe('FileSystemClipboardState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.fileSystemClipboard.setState(
      FileSystemClipboardState.defaultState()
    );
  });

  test('dummy', () => {
    expect(true).toBe(true);
  });
});
