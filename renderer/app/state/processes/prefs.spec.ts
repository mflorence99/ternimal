import { Bundle } from '../state.spec';
import { ProcessListPrefsState } from './prefs';

import { prepare } from '../state.spec';

describe('ProcessListPrefsState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.processListPrefs.setState({
      byLayoutID: {},
      bySplitID: {},
      global: ProcessListPrefsState.defaultPrefs(),
      scope: 'global'
    });
  });

  test('dummy', () => {
    expect(true).toBe(true);
  });
});
