import { Bundle } from '../state.spec';

import { prepare } from '../state.spec';

describe('ProcessListState', () => {

  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.processList.setState([]);
  });

  test('dummy', () => {
    expect(true).toBe(true);
  });

});
