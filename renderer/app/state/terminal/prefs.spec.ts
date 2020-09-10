import { Bundle } from '../state.spec';
import { PrefsStateModel } from '../prefs';
import { TerminalPrefs } from './prefs';
import { TerminalPrefsState } from './prefs';

import { prepare } from '../state.spec';

import 'jest-extended';

// @see __mocks__/ngx-electron

type Prefs = TerminalPrefs;

const state: PrefsStateModel<TerminalPrefs> = {
  byLayoutID: {
    l: { root: '/l' } as Prefs
  },
  bySplitID: {
    s: { root: '/s' } as Prefs
  },
  global: { root: '/g' } as Prefs,
  scope: 'global'
};

describe('TerminalPrefsState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.terminalPrefs.setState(state);
    bundle.terminalPrefs.selection.selectLayout({ layoutID: 'l' });
    bundle.terminalPrefs.selection.selectSplit({ splitID: 's' });
  });

  test('emptyPrefs', () => {
    expect(TerminalPrefsState.emptyPrefs()).toEqual({
      cursorBlink: null,
      cursorStyle: null,
      cursorWidth: null,
      fontFamily: null,
      fontSize: null,
      fontWeight: null,
      fontWeightBold: null,
      letterSpacing: null,
      lineHeight: null,
      rendererType: null,
      root: null,
      scrollSensitivity: null,
      scrollback: null,
      showTitles: null,
      theme: null,
      title: null
    });
  });

  test('remove - layout', () => {
    bundle.terminalPrefs.remove({ layoutID: 'l' });
    expect(bundle.terminalPrefs.byLayoutID).toEqual({});
  });

  test('remove - split', () => {
    bundle.terminalPrefs.remove({ splitID: 's' });
    expect(bundle.terminalPrefs.bySplitID).toEqual({});
  });

  test('rescope', () => {
    bundle.terminalPrefs.rescope({ scope: 'bySplitID' });
    expect(bundle.terminalPrefs.scope).toEqual('bySplitID');
  });

  test('update - global', () => {
    bundle.terminalPrefs.update({ prefs: { root: '/h' } });
    expect(bundle.terminalPrefs.global).toEqual({ root: '/h' });
  });

  test('update - by new layout', () => {
    bundle.terminalPrefs.update({ layoutID: 'm', prefs: { root: '/m' } });
    expect(bundle.terminalPrefs.snapshot.byLayoutID).toEqual({
      l: { root: '/l' },
      m: { root: '/m' }
    });
  });

  test('update - by existing layout', () => {
    bundle.terminalPrefs.update({ layoutID: 'l', prefs: { root: '/m' } });
    expect(bundle.terminalPrefs.snapshot.byLayoutID).toEqual({
      l: { root: '/m' }
    });
  });

  test('update - by new split', () => {
    bundle.terminalPrefs.update({ splitID: 't', prefs: { root: '/t' } });
    expect(bundle.terminalPrefs.snapshot.bySplitID).toEqual({
      s: { root: '/s' },
      t: { root: '/t' }
    });
  });

  test('update - by existing split', () => {
    bundle.terminalPrefs.update({ splitID: 's', prefs: { root: '/t' } });
    expect(bundle.terminalPrefs.snapshot.bySplitID).toEqual({
      s: { root: '/t' }
    });
  });

  test('dictionary', () => {
    expect(bundle.terminalPrefs.dictionary).toEqual([]);
  });

  test('byLayoutID - unknowm layout', () => {
    bundle.terminalPrefs.selection.selectLayout({ layoutID: 'x' });
    expect(bundle.terminalPrefs.byLayoutID).toEqual({});
  });

  test('bySplitID - unknowm split', () => {
    bundle.terminalPrefs.selection.selectSplit({ splitID: 'x' });
    expect(bundle.terminalPrefs.bySplitID).toEqual({});
  });

  test('effectivePrefs', () => {
    const prefs = bundle.terminalPrefs.effectivePrefs('l', 's');
    expect(prefs).toEqual({ root: '/s' });
  });

  test('handleActions$/remove', () => {
    bundle.terminalPrefs.ngxsOnInit();
    // pretend that some action has deleted a split
    // NOTE: we cheated and made Actions a Subject rather than an Observable
    bundle.terminalPrefs.actions$['next']({
      action: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'PanesState.remove': {
          splitID: 's'
        }
      },
      status: 'SUCCESSFUL'
    });
    expect(bundle.terminalPrefs.bySplitID).toEqual({});
  });
});
