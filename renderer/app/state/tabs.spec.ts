import { Bundle } from './state.spec';
import { Params } from '../services/params';
import { Tab } from './tabs';
import { TabsState } from './tabs';

import { prepare } from './state.spec';

describe('TabsState', () => {

  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.tabs.setState(TabsState.defaultTabs());
  });

  test('newTab/removeTab', () => {
    expect(bundle.tabs.snapshot.length).toBe(1);
    const tab: Tab = { color: 'c', icon: ['i', 'j'], label: 'l', layoutID: 'a' };
    bundle.tabs.newTab({ tab });
    expect(bundle.tabs.snapshot.length).toBe(2);
    bundle.tabs.removeTab({ tab });
    expect(bundle.tabs.snapshot.length).toBe(1);
  });

  test('moveTab - left', () => {
    const b: Tab = { color: 'c', icon: ['i', 'j'], label: 'l', layoutID: 'b' };
    const c: Tab = { color: 'c', icon: ['i', 'j'], label: 'l', layoutID: 'c' };
    bundle.tabs.newTab({ tab: b });
    bundle.tabs.newTab({ tab: c });
    expect(bundle.tabs.snapshot.length).toBe(3);
    expect(bundle.tabs.snapshot[1].layoutID).toBe('b');
    expect(bundle.tabs.snapshot[2].layoutID).toBe('c');
    bundle.tabs.moveTab({ tab: c, ix: 1 });
    expect(bundle.tabs.snapshot.length).toBe(3);
    expect(bundle.tabs.snapshot[1].layoutID).toBe('c');
    expect(bundle.tabs.snapshot[2].layoutID).toBe('b');
  });

  test('moveTab - right', () => {
    const b: Tab = { color: 'c', icon: ['i', 'j'], label: 'l', layoutID: 'b' };
    const c: Tab = { color: 'c', icon: ['i', 'j'], label: 'l', layoutID: 'c' };
    bundle.tabs.newTab({ tab: b });
    bundle.tabs.newTab({ tab: c });
    expect(bundle.tabs.snapshot.length).toBe(3);
    expect(bundle.tabs.snapshot[1].layoutID).toBe('b');
    expect(bundle.tabs.snapshot[2].layoutID).toBe('c');
    bundle.tabs.moveTab({ tab: b, ix: 3 });
    expect(bundle.tabs.snapshot.length).toBe(3);
    expect(bundle.tabs.snapshot[1].layoutID).toBe('c');
    expect(bundle.tabs.snapshot[2].layoutID).toBe('b');
  });

  test('updateTab', () => {
    const tab: Tab = { color: 'c', icon: ['i', 'j'], label: 'l', layoutID: 'a' };
    bundle.tabs.newTab({ tab });
    expect(bundle.tabs.snapshot.length).toBe(2);
    expect(bundle.tabs.snapshot[1].color).toBe('c');
    expect(bundle.tabs.snapshot[1].icon).toEqual(['i', 'j']);
    expect(bundle.tabs.snapshot[1].label).toBe('l');
    bundle.tabs.updateTab({ tab: { color: 'd', icon: ['p', 'q'], label: 'k', layoutID: 'a' } });
    expect(bundle.tabs.snapshot.length).toBe(2);
    expect(bundle.tabs.snapshot[1].color).toBe('d');
    expect(bundle.tabs.snapshot[1].icon).toEqual(['p', 'q']);
    expect(bundle.tabs.snapshot[1].label).toBe('k');
    expect(bundle.tabs.snapshot[1].layoutID).toBe('a');
  });

  test('tab accessor', () => {
    bundle.selection.selectLayout({ layoutID: Params.uuid });
    expect(bundle.tabs.tab.layoutID).toBe(Params.uuid);
  });

  test('tabIndex accessor', () => {
    bundle.selection.selectLayout({ layoutID: Params.uuid });
    expect(bundle.tabs.tabIndex).toBe(0);
  });

});
