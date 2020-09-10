import { Bundle } from '../state.spec';
import { Channels } from '../../common';

import { on } from '../../common';
import { prepare } from '../state.spec';

import 'jest-extended';

// @see __mocks__/ngx-electron

const state: Record<string, string[]> = {
  a: ['/a/1', '/a/2'],
  b: ['/b/1']
};

describe('FileSystemPathsState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.fileSystemPaths.setState(state);
  });

  test('close', () => {
    bundle.fileSystemPaths.close({ splitID: 'a', path: '/a/2' });
    expect(bundle.fileSystemPaths.isOpen('a', '/a/1')).toBeTrue();
    expect(bundle.fileSystemPaths.isOpen('a', '/a/2')).toBeFalse();
    expect(bundle.fileSystemPaths.snapshot).toEqual({
      a: ['/a/1'],
      b: ['/b/1']
    });
  });

  test('close - split not found', () => {
    bundle.fileSystemPaths.close({ splitID: 'c', path: '/c/1' });
    expect(bundle.fileSystemPaths.snapshot).toEqual(state);
  });

  test('open - new split', () => {
    bundle.fileSystemPaths.open({ splitID: 'c', path: '/c/1' });
    expect(bundle.fileSystemPaths.snapshot).toEqual({
      a: ['/a/1', '/a/2'],
      b: ['/b/1'],
      c: ['/c/1']
    });
  });

  test('open - new path', () => {
    bundle.fileSystemPaths.open({ splitID: 'b', path: '/b/2' });
    expect(bundle.fileSystemPaths.snapshot).toEqual({
      a: ['/a/1', '/a/2'],
      b: ['/b/1', '/b/2']
    });
  });

  test('open - existing path', () => {
    bundle.fileSystemPaths.open({ splitID: 'b', path: '/b/1' });
    expect(bundle.fileSystemPaths.snapshot).toEqual(state);
  });

  test('remove', () => {
    bundle.fileSystemPaths.remove({ splitID: 'b' });
    expect(bundle.fileSystemPaths.snapshot).toEqual({
      a: ['/a/1', '/a/2']
    });
  });

  test('isOpen - split not found', () => {
    expect(bundle.fileSystemPaths.isOpen('c', '/c/1')).toBeFalse();
  });

  test('handleActions$/remove', () => {
    bundle.fileSystemPaths.ngxsOnInit();
    // pretend that some action has deleted a split
    // NOTE: we cheated and made Actions a Subject rather than an Observable
    bundle.fileSystemPaths.actions$['next']({
      action: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'PanesState.remove': {
          splitID: 'b'
        }
      },
      status: 'SUCCESSFUL'
    });
    expect(bundle.fileSystemPaths.snapshot).toEqual({
      a: ['/a/1', '/a/2']
    });
  });

  test('rcvPath$ - fsLoadPathFailure', () => {
    bundle.fileSystemPaths.ngxsOnInit();
    on(Channels.fsLoadPathFailure)(undefined, '/a/2');
    expect(bundle.fileSystemPaths.snapshot).toEqual({
      a: ['/a/1'],
      b: ['/b/1']
    });
  });
});
