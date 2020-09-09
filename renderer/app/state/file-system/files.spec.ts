import { Bundle } from '../state.spec';
import { FileDescriptor } from '../../common';
import { FileSystemFilesStateModel } from './files';

import { prepare } from '../state.spec';

import 'jest-extended';

// @see __mocks__/ngx-electron

const state: FileSystemFilesStateModel = {
  '/a': [
    { path: '/a/1' } as FileDescriptor,
    { path: '/a/2' } as FileDescriptor
  ],
  '/b': [{ path: '/b/1' } as FileDescriptor]
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
      descs: [{ path: '/c/1' } as FileDescriptor]
    });
    expect(bundle.fileSystemFiles.snapshot).toEqual({
      '/a': [
        { path: '/a/1' } as FileDescriptor,
        { path: '/a/2' } as FileDescriptor
      ],
      '/b': [{ path: '/b/1' } as FileDescriptor],
      '/c': [{ path: '/c/1' } as FileDescriptor]
    });
  });

  test('unloadPath', () => {
    bundle.fileSystemFiles.unloadPath({
      path: '/a'
    });
    expect(bundle.fileSystemFiles.snapshot).toEqual({
      '/b': [{ path: '/b/1' } as FileDescriptor]
    });
  });

  test('descsForPaths', () => {
    const descs = bundle.fileSystemFiles.descsForPaths([
      '/a/1',
      '/a/2',
      '/b/1'
    ]);
    expect(descs).toEqual([
      { path: '/a/1' },
      { path: '/a/2' },
      { path: '/b/1' }
    ]);
  });
});
