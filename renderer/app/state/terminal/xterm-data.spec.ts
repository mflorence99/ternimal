import { Bundle } from '../state.spec';

import { prepare } from '../state.spec';

describe('TerminalXtermDataState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.terminalXtermData.setState({});
  });

  test('dummy', () => {
    expect(true).toBe(true);
  });
});
