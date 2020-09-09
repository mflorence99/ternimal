import { Bundle } from './state.spec';
import { Tab } from './tabs';

import { prepare } from './state.spec';

import 'jest-extended';

const state: Tab[] = [
  { layoutID: 'a' },
  { layoutID: 'b' },
  { layoutID: 'c' },
  { layoutID: 'd' }
];

describe('TabsState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.tabs.setState(state);
  });

  test('move - left', () => {
    bundle.tabs.move({ tab: { layoutID: 'b' }, ix: 0 });
    expect(bundle.tabs.snapshot).toEqual([
      { layoutID: 'b' },
      { layoutID: 'a' },
      { layoutID: 'c' },
      { layoutID: 'd' }
    ]);
  });

  test('move - right', () => {
    bundle.tabs.move({ tab: { layoutID: 'b' }, ix: 2 });
    expect(bundle.tabs.snapshot).toEqual([
      { layoutID: 'a' },
      { layoutID: 'c' },
      { layoutID: 'b' },
      { layoutID: 'd' }
    ]);
  });

  test('move - unchanged', () => {
    bundle.tabs.move({ tab: { layoutID: 'b' }, ix: 1 });
    expect(bundle.tabs.snapshot).toEqual([
      { layoutID: 'a' },
      { layoutID: 'b' },
      { layoutID: 'c' },
      { layoutID: 'd' }
    ]);
  });

  test('move - does not exist', () => {
    bundle.tabs.move({ tab: { layoutID: 'x' }, ix: 1 });
    expect(bundle.tabs.snapshot).toEqual([
      { layoutID: 'a' },
      { layoutID: 'b' },
      { layoutID: 'c' },
      { layoutID: 'd' }
    ]);
  });

  test('newTab/remove', () => {
    bundle.tabs.newTab({ tab: { layoutID: 'e', color: 'red' } });
    expect(bundle.tabs.snapshot).toEqual([
      { layoutID: 'a' },
      { layoutID: 'b' },
      { layoutID: 'c' },
      { layoutID: 'd' },
      { layoutID: 'e', color: 'red' }
    ]);
    // remove the new tab and we're back where we started
    bundle.tabs.remove({ tab: { layoutID: 'e' } });
    expect(bundle.tabs.snapshot).toEqual(state);
  });

  test('remove - does not exist', () => {
    bundle.tabs.move({ tab: { layoutID: 'x' } });
    expect(bundle.tabs.snapshot).toEqual([
      { layoutID: 'a' },
      { layoutID: 'b' },
      { layoutID: 'c' },
      { layoutID: 'd' }
    ]);
  });

  test('update', () => {
    bundle.tabs.update({ tab: { layoutID: 'a', color: 'black' } });
    expect(bundle.tabs.snapshot).toEqual([
      { layoutID: 'a', color: 'black' },
      { layoutID: 'b' },
      { layoutID: 'c' },
      { layoutID: 'd' }
    ]);
  });

  test('update - does not exist', () => {
    bundle.tabs.update({ tab: { layoutID: 'x', color: 'black' } });
    expect(bundle.tabs.snapshot).toEqual([
      { layoutID: 'a' },
      { layoutID: 'b' },
      { layoutID: 'c' },
      { layoutID: 'd' }
    ]);
  });

  test('tab', () => {
    bundle.selection.selectLayout({ layoutID: 'b' });
    expect(bundle.tabs.tab).toEqual({ layoutID: 'b' });
  });

  test('tabIndex', () => {
    bundle.selection.selectLayout({ layoutID: 'c' });
    expect(bundle.tabs.tabIndex).toBe(2);
  });

  test('findTabByID', () => {
    expect(bundle.tabs.findTabByID('d')).toEqual({ layoutID: 'd' });
  });

  test('findTabIndexByID', () => {
    expect(bundle.tabs.findTabIndexByID('d')).toBe(3);
  });
});
