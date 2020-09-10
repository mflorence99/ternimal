import { Bundle } from '../state.spec';
import { PrefsStateModel } from '../prefs';
import { ProcessListPrefs } from './prefs';
import { ProcessListPrefsState } from './prefs';

import { prepare } from '../state.spec';

import 'jest-extended';

type Prefs = ProcessListPrefs;

const state: PrefsStateModel<ProcessListPrefs> = {
  byLayoutID: {
    l: { timeFormat: 'duration' } as Prefs
  },
  bySplitID: {
    s: { timeFormat: 'hhmmss' } as Prefs
  },
  global: { timeFormat: undefined } as Prefs,
  scope: 'global'
};

describe('ProcessListPrefsState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.processListPrefs.setState(state);
    bundle.processListPrefs.selection.selectLayout({ layoutID: 'l' });
    bundle.processListPrefs.selection.selectSplit({ splitID: 's' });
  });

  test('emptyPrefs', () => {
    expect(ProcessListPrefsState.emptyPrefs()).toEqual({
      showSparkline: null,
      timeFormat: null,
      visibility: {
        cmd: null,
        cpu: null,
        ctime: null,
        memory: null,
        name: null,
        pid: null,
        ppid: null,
        uid: null
      }
    });
  });

  test('remove - layout', () => {
    bundle.processListPrefs.remove({ layoutID: 'l' });
    expect(bundle.processListPrefs.byLayoutID).toEqual({});
  });

  test('remove - split', () => {
    bundle.processListPrefs.remove({ splitID: 's' });
    expect(bundle.processListPrefs.bySplitID).toEqual({});
  });

  test('rescope', () => {
    bundle.processListPrefs.rescope({ scope: 'bySplitID' });
    expect(bundle.processListPrefs.scope).toEqual('bySplitID');
  });

  test('update - by new layout', () => {
    bundle.processListPrefs.update({
      layoutID: 'm',
      prefs: { timeFormat: 'duration' }
    });
    expect(bundle.processListPrefs.snapshot.byLayoutID).toEqual({
      l: { timeFormat: 'duration' },
      m: { timeFormat: 'duration' }
    });
  });

  test('update - by existing layout', () => {
    bundle.processListPrefs.update({
      layoutID: 'l',
      prefs: { timeFormat: 'hhmmss' }
    });
    expect(bundle.processListPrefs.snapshot.byLayoutID).toEqual({
      l: { timeFormat: 'hhmmss' }
    });
  });

  test('update - by new split', () => {
    bundle.processListPrefs.update({
      splitID: 't',
      prefs: { timeFormat: 'duration' }
    });
    expect(bundle.processListPrefs.snapshot.bySplitID).toEqual({
      s: { timeFormat: 'hhmmss' },
      t: { timeFormat: 'duration' }
    });
  });

  test('update - by existing split', () => {
    bundle.processListPrefs.update({
      splitID: 's',
      prefs: { timeFormat: 'duration' }
    });
    expect(bundle.processListPrefs.snapshot.bySplitID).toEqual({
      s: { timeFormat: 'duration' }
    });
  });

  test('dictionary', () => {
    // make sure all the fields have visibility
    const names = bundle.processListPrefs.dictionary.map((dict) => dict.name);
    const visibles = Object.keys(
      ProcessListPrefsState.defaultPrefs().visibility
    );
    expect(names).toIncludeSameMembers(visibles);
  });

  test('byLayoutID - unknowm layout', () => {
    bundle.processListPrefs.selection.selectLayout({ layoutID: 'x' });
    expect(bundle.processListPrefs.byLayoutID).toEqual({});
  });

  test('bySplitID - unknowm split', () => {
    bundle.processListPrefs.selection.selectSplit({ splitID: 'x' });
    expect(bundle.processListPrefs.bySplitID).toEqual({});
  });

  test('effectivePrefs', () => {
    const prefs = bundle.processListPrefs.effectivePrefs('l', 's');
    expect(prefs).toEqual({ timeFormat: 'hhmmss' });
  });

  test('handleActions$/remove', () => {
    bundle.processListPrefs.ngxsOnInit();
    // pretend that some action has deleted a layout
    // NOTE: we cheated and made Actions a Subject rather than an Observable
    bundle.processListPrefs.actions$['next']({
      action: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'LayoutState.remove': {
          layoutID: 'l'
        }
      },
      status: 'SUCCESSFUL'
    });
    expect(bundle.processListPrefs.byLayoutID).toEqual({});
  });
});
