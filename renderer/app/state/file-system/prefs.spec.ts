import { Bundle } from '../state.spec';
import { FileSystemPrefs } from './prefs';
import { FileSystemPrefsState } from './prefs';
import { PrefsStateModel } from '../prefs';

import { prepare } from '../state.spec';

import 'jest-extended';

// @see __mocks__/ngx-electron

type Prefs = FileSystemPrefs;

const state: PrefsStateModel<FileSystemPrefs> = {
  byLayoutID: {
    l: { root: '/l' } as Prefs
  },
  bySplitID: {
    s: { root: '/s' } as Prefs
  },
  global: { root: '/g' } as Prefs,
  scope: 'global'
};

describe('FileSystemPrefsState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.fileSystemPrefs.setState(state);
    bundle.fileSystemPrefs.selection.selectLayout({ layoutID: 'l' });
    bundle.fileSystemPrefs.selection.selectSplit({ splitID: 's' });
  });

  test('emptyPrefs', () => {
    expect(FileSystemPrefsState.emptyPrefs()).toEqual({
      dateFormat: null,
      quantityFormat: null,
      root: null,
      showHiddenFiles: null,
      sortDirectories: null,
      timeFormat: null,
      visibility: {
        atime: null,
        btime: null,
        group: null,
        mode: null,
        mtime: null,
        name: null,
        size: null,
        user: null
      }
    });
  });

  test('remove - layout', () => {
    bundle.fileSystemPrefs.remove({ layoutID: 'l' });
    expect(bundle.fileSystemPrefs.byLayoutID).toEqual({});
  });

  test('remove - split', () => {
    bundle.fileSystemPrefs.remove({ splitID: 's' });
    expect(bundle.fileSystemPrefs.bySplitID).toEqual({});
  });

  test('rescope', () => {
    bundle.fileSystemPrefs.rescope({ scope: 'bySplitID' });
    expect(bundle.fileSystemPrefs.scope).toEqual('bySplitID');
  });

  test('update - global', () => {
    bundle.fileSystemPrefs.update({ prefs: { root: '/h' } });
    expect(bundle.fileSystemPrefs.global).toEqual({ root: '/h' });
  });

  test('update - by new layout', () => {
    bundle.fileSystemPrefs.update({ layoutID: 'm', prefs: { root: '/m' } });
    expect(bundle.fileSystemPrefs.snapshot.byLayoutID).toEqual({
      l: { root: '/l' },
      m: { root: '/m' }
    });
  });

  test('update - by existing layout', () => {
    bundle.fileSystemPrefs.update({ layoutID: 'l', prefs: { root: '/m' } });
    expect(bundle.fileSystemPrefs.snapshot.byLayoutID).toEqual({
      l: { root: '/m' }
    });
  });

  test('update - by new split', () => {
    bundle.fileSystemPrefs.update({ splitID: 't', prefs: { root: '/t' } });
    expect(bundle.fileSystemPrefs.snapshot.bySplitID).toEqual({
      s: { root: '/s' },
      t: { root: '/t' }
    });
  });

  test('update - by existing split', () => {
    bundle.fileSystemPrefs.update({ splitID: 's', prefs: { root: '/t' } });
    expect(bundle.fileSystemPrefs.snapshot.bySplitID).toEqual({
      s: { root: '/t' }
    });
  });

  test('dictionary', () => {
    // make sure all the fields have visibility
    const names = bundle.fileSystemPrefs.dictionary.map((dict) => dict.name);
    const visibles = Object.keys(
      FileSystemPrefsState.defaultPrefs().visibility
    );
    expect(names).toIncludeSameMembers(visibles);
  });

  test('byLayoutID - unknowm layout', () => {
    bundle.fileSystemPrefs.selection.selectLayout({ layoutID: 'x' });
    expect(bundle.fileSystemPrefs.byLayoutID).toEqual({});
  });

  test('bySplitID - unknowm split', () => {
    bundle.fileSystemPrefs.selection.selectSplit({ splitID: 'x' });
    expect(bundle.fileSystemPrefs.bySplitID).toEqual({});
  });

  test('effectivePrefs', () => {
    const prefs = bundle.fileSystemPrefs.effectivePrefs('l', 's');
    expect(prefs).toEqual({ root: '/s' });
  });

  test('handleActions$/remove', () => {
    bundle.fileSystemPrefs.ngxsOnInit();
    // pretend that some action has deleted a split
    // NOTE: we cheated and made Actions a Subject rather than an Observable
    bundle.fileSystemPrefs.actions$['next']({
      action: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'PanesState.remove': {
          splitID: 's'
        }
      },
      status: 'SUCCESSFUL'
    });
    expect(bundle.fileSystemPrefs.bySplitID).toEqual({});
  });
});
