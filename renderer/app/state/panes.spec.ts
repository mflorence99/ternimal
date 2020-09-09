import { Bundle } from './state.spec';
import { PanePrefs } from './panes';
import { PanesState } from './panes';

import { prepare } from './state.spec';

import 'jest-extended';

const state: Record<string, PanePrefs> = {
  a: {
    widget: 'a.1'
  },
  b: {
    widget: 'b.1'
  },
  c: {
    widget: 'c.1'
  }
};

describe('PanesState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.panes.setState(state);
  });

  test('remove', () => {
    bundle.panes.remove({ splitID: 'b' });
    expect(bundle.panes.snapshot).toEqual({
      a: {
        widget: 'a.1'
      },
      c: {
        widget: 'c.1'
      }
    });
  });

  test('update - create new', () => {
    bundle.panes.update({ splitID: 'd', prefs: { widget: 'd.1' } });
    expect(bundle.panes.snapshot).toEqual({
      a: {
        widget: 'a.1'
      },
      b: {
        widget: 'b.1'
      },
      c: {
        widget: 'c.1'
      },
      d: {
        widget: 'd.1'
      }
    });
  });

  test('update - change existing', () => {
    bundle.panes.update({ splitID: 'b', prefs: { widget: 'b.2' } });
    expect(bundle.panes.snapshot).toEqual({
      a: {
        widget: 'a.1'
      },
      b: {
        widget: 'b.2'
      },
      c: {
        widget: 'c.1'
      }
    });
  });

  test('prefs', () => {
    expect(bundle.panes.prefs('b')).toEqual({ widget: 'b.1' });
  });

  test('prefs - not found', () => {
    expect(bundle.panes.prefs('does not exist')).toEqual(
      PanesState.defaultPrefs()
    );
  });
});
