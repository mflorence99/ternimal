import { Bundle } from './state.spec';

import { prepare } from './state.spec';

describe('PanesState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.panes.setState({});
  });
});
