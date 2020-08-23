import { Bundle } from '../state.spec';
import { TerminalPrefsState } from './prefs';

import { prepare } from '../state.spec';

describe('TerminalPrefsState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.terminalPrefs.setState({
      byLayoutID: {},
      bySplitID: {},
      global: TerminalPrefsState.defaultPrefs(),
      scope: 'global'
    });
  });

  test('dummy', () => {
    expect(true).toBe(true);
  });
});
