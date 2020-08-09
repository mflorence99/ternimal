import { Bundle } from './state.spec';

import { prepare } from './state.spec';

describe('StatusState', () => {

  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.panes.setState({ });
  });

});
