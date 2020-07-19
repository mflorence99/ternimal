import { Bundle } from './state.spec';

import { prepare } from './state.spec';

describe('TernimalState', () => {

  let bundle: Bundle;

  beforeEach(() => bundle = prepare());

  test('Ternimal can be enabled and disabled', () => {
    expect(bundle.ternimal.isEnabled).toBe(true);
    bundle.ternimal.enable({ enabled: false });
    expect(bundle.ternimal.isEnabled).toBe(false);
  });

  test('Ternimal can compute a locally unique number', () => {
    const unique1 = bundle.ternimal.unique;
    const unique2 = bundle.ternimal.unique;
    expect(unique2 - unique1).toBe(1);
  });

});
