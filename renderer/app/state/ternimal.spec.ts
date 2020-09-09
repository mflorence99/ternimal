import { Bundle } from './state.spec';
import { Channels } from '../common';
import { TernimalStateModel } from './ternimal';

import { on } from '../common';
import { prepare } from './state.spec';

import 'jest-extended';

// @see __mocks__/ngx-electron

const state: TernimalStateModel = {
  enabled: true,
  longRunningOp: {
    id: null,
    item: null,
    progress: 0,
    running: false
  },
  showTabPrefs: false,
  showWidgetSidebar: false,
  unique: {},
  widgetSidebarCtx: null,
  widgetSidebarImpl: null
};

describe('TernimalState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.ternimal.setState(state);
  });

  test('enable', () => {
    bundle.ternimal.enable({ enabled: false });
    expect(bundle.ternimal.isEnabled).toBeFalse();
    bundle.ternimal.enable({ enabled: true });
    expect(bundle.ternimal.isEnabled).toBeTrue();
  });

  test('hide/showTabPrefs', () => {
    bundle.ternimal.showTabPrefs();
    expect(bundle.ternimal.tabPrefsShowing).toBeTrue();
    bundle.ternimal.hideTabPrefs();
    expect(bundle.ternimal.tabPrefsShowing).toBeFalse();
  });

  test('hide/showWidgetSidebar', () => {
    bundle.ternimal.showWidgetSidebar({ implementation: 'i', context: 'c' });
    expect(bundle.ternimal.widgetSidebarCtx).toBe('c');
    expect(bundle.ternimal.widgetSidebarImpl).toBe('i');
    expect(bundle.ternimal.widgetSidebarShowing).toBeTrue();
    bundle.ternimal.hideWidgetSidebar();
    expect(bundle.ternimal.widgetSidebarShowing).toBeFalse();
  });

  test('updateLongRunningOp', () => {
    const op = {
      id: 'a',
      item: 'b',
      progress: 25,
      running: true
    };
    bundle.ternimal.updateLongRunningOp({
      longRunningOp: op
    });
    expect(bundle.ternimal.longRunningOp).toEqual(op);
  });

  test('unique', () => {
    expect(bundle.ternimal.unique('p')).toBe(1);
    expect(bundle.ternimal.unique('q')).toBe(1);
    expect(bundle.ternimal.unique('p')).toBe(2);
  });

  test('rcvProgress$', () => {
    const op = {
      id: 'a',
      item: 'b',
      progress: 100,
      running: false
    };
    bundle.ternimal.ngxsOnInit();
    on(Channels.longRunningOpProgress)(undefined, op);
    expect(bundle.ternimal.longRunningOp).toEqual(op);
  });
});
