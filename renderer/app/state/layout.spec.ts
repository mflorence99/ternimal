import { Bundle } from './state.spec';
import { Params } from '../services/params';

import { prepare } from './state.spec';

describe('ConfigsState', () => {

  let bundle: Bundle;

  beforeEach(() => bundle = prepare());

  test('LayoutState is initialized', () => {
    expect(bundle.layout.findSplitByID(Params.uuid)).toBeTruthy();
  });

});
