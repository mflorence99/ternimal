import { Bundle } from './state.spec';

import { prepare } from './state.spec';

describe('SortState', () => {

  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.sort.setState({ });
  });

});
