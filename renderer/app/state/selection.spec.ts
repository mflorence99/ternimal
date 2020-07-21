import { Bundle } from './state.spec';
import { SelectionState } from './selection';

import { prepare } from './state.spec';

describe('SelectionState', () => {

  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.selection.setState(SelectionState.defaultSelection());
  });

  test('selectLayout', () => {
    bundle.selection.selectLayout({ layoutID: 'p' });
    expect(bundle.selection.layoutID).toBe('p');
  });

  test('selectSplit', () => {
    bundle.selection.selectLayout({ layoutID: 'q' });
    expect(bundle.selection.layoutID).toBe('q');
    bundle.selection.selectSplit({ splitID: 's' });
    expect(bundle.selection.splitID).toBe('s');
    bundle.selection.selectLayout({ layoutID: 'r' });
    bundle.selection.selectSplit({ splitID: 't' });
    expect(bundle.selection.splitID).toBe('t');
    bundle.selection.selectLayout({ layoutID: 'q' });
    expect(bundle.selection.splitID).toBe('s');
  });

});
