import { Bundle } from '../state.spec';
import { Channels } from '../../common';
import { FileDescriptor } from '../../common';
import { FileSystemFilesStateModel } from './files';

import { on } from '../../common';
import { prepare } from '../state.spec';

import 'jest-extended';

// @see __mocks__/ngx-electron

type Desc = FileDescriptor;

const state: FileSystemFilesStateModel = {
  '/a': [{ path: '/a/1' } as Desc, { path: '/a/2' } as Desc],
  '/b': [{ path: '/b/1' } as Desc]
};

describe('FileSystemFilesState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.fileSystemFiles.setState(state);
  });

  test('loadPath', () => {
    bundle.fileSystemFiles.loadPath({
      path: '/c',
      descs: [{ path: '/c/1' } as Desc]
    });
    expect(bundle.fileSystemFiles.snapshot).toEqual({
      '/a': [{ path: '/a/1' } as Desc, { path: '/a/2' } as Desc],
      '/b': [{ path: '/b/1' } as Desc],
      '/c': [{ path: '/c/1' } as Desc]
    });
  });

  test('unloadPath', () => {
    bundle.fileSystemFiles.unloadPath({
      path: '/a'
    });
    expect(bundle.fileSystemFiles.snapshot).toEqual({
      '/b': [{ path: '/b/1' } as Desc]
    });
  });

  test('descsForPaths', () => {
    const descs = bundle.fileSystemFiles.descsForPaths([
      '/a',
      '/a/1',
      '/a/2',
      '/b',
      '/b/1'
    ]);
    expect(descs).toEqual([
      { path: '/a/1' },
      { path: '/a/2' },
      { path: '/b/1' }
    ]);
  });

  test('loadPaths', (done) => {
    bundle.fileSystemFiles.loading$.subscribe((path) => {
      expect(path).toEqual({ '/c': true });
      done();
    });
    // trigger the load
    bundle.fileSystemFiles.loadPaths(['/c']);
    expect(
      // eslint-disable-next-line @typescript-eslint/unbound-method
      bundle.fileSystemFiles.electron.ipcRenderer.send
    ).toHaveBeenCalledWith(Channels.fsLoadPathRequest, '/c');
  });

  test('loadPaths - already present', () => {
    bundle.fileSystemFiles.loadPaths(['/a']);
    expect(
      // eslint-disable-next-line @typescript-eslint/unbound-method
      bundle.fileSystemFiles.electron.ipcRenderer.send
    ).not.toHaveBeenCalledWith(Channels.fsLoadPathRequest, '/a');
  });

  test('rcvPath$ - fsLoadPathSuccess', (done) => {
    bundle.fileSystemFiles.loading$.subscribe((path) => {
      expect(path).toEqual({ '/c': false });
      done();
    });
    // trigger the load
    bundle.fileSystemFiles.ngxsOnInit();
    on(Channels.fsLoadPathSuccess)(undefined, '/c', [{ path: '/c/1' } as Desc]);
    expect(bundle.fileSystemFiles.snapshot).toEqual({
      '/a': [{ path: '/a/1' } as Desc, { path: '/a/2' } as Desc],
      '/b': [{ path: '/b/1' } as Desc],
      '/c': [{ path: '/c/1' } as Desc]
    });
  });

  test('rcvPath$ - fsLoadPathFailure', (done) => {
    bundle.fileSystemFiles.loading$.subscribe((path) => {
      expect(path).toEqual({ '/c': false });
      done();
    });
    // trigger the load
    bundle.fileSystemFiles.ngxsOnInit();
    on(Channels.fsLoadPathFailure)(undefined, '/c');
    expect(bundle.fileSystemFiles.snapshot).toEqual(state);
  });
});
