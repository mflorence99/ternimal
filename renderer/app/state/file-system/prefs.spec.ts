import { Bundle } from '../state.spec';
import { FileSystemPrefsState } from './prefs';

import { prepare } from '../state.spec';

describe('FileSystemPrefsState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.fileSystemPrefs.setState({
      byLayoutID: {},
      bySplitID: {},
      global: FileSystemPrefsState.defaultPrefs(),
      scope: 'global'
    });
  });

  test('dummy', () => {
    expect(true).toBe(true);
  });
});
