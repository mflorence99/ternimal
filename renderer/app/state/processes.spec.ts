import { Bundle } from './state.spec';

import { prepare } from './state.spec';

describe('ProcessesState', () => {

  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.processes.setState([]);
  });

  test('dummy', () => {
    expect(true).toBe(true);
  });

});
