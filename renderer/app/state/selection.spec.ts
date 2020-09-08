import { Bundle } from './state.spec';
import { SelectionStateModel } from './selection';

import { prepare } from './state.spec';

const state: SelectionStateModel = {
  layoutID: 'a',
  splitIDByLayoutID: {
    a: 'a.1',
    b: 'b.1'
  }
};

describe('SelectionState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.selection.setState(state);
  });

  test('selectLayout', () => {
    bundle.selection.selectLayout({ layoutID: 'b' });
    expect(bundle.selection.snapshot).toEqual({
      layoutID: 'b',
      splitIDByLayoutID: {
        a: 'a.1',
        b: 'b.1'
      }
    });
  });

  test('selectSplit', () => {
    bundle.selection.selectSplit({ splitID: 'a.2' });
    expect(bundle.selection.snapshot).toEqual({
      layoutID: 'a',
      splitIDByLayoutID: {
        a: 'a.2',
        b: 'b.1'
      }
    });
  });

  test('layoutID', () => {
    expect(bundle.selection.layoutID).toBe('a');
  });

  test('splitID', () => {
    expect(bundle.selection.splitID).toBe('a.1');
  });
});
