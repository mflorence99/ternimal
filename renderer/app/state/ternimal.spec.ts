import { Bundle } from './state.spec';

import { prepare } from './state.spec';

describe('TernimalState', () => {
  let bundle: Bundle;

  beforeEach(() => (bundle = prepare()));

  test('Ternimal can be enabled and disabled', () => {
    expect(bundle.ternimal.isEnabled).toBe(true);
    bundle.ternimal.enable({ enabled: false });
    expect(bundle.ternimal.isEnabled).toBe(false);
  });

  test('Tab prefs can be shown/hidden', () => {
    expect(bundle.ternimal.tabPrefsShowing).toBe(false);
    bundle.ternimal.hideTabPrefs();
    expect(bundle.ternimal.tabPrefsShowing).toBe(false);
    bundle.ternimal.showTabPrefs();
    expect(bundle.ternimal.tabPrefsShowing).toBe(true);
  });

  test('Ternimal can compute a locally unique number', () => {
    const unique1 = bundle.ternimal.unique('tab');
    const unique2 = bundle.ternimal.unique('tab');
    expect(unique2 - unique1).toBe(1);
  });
});
