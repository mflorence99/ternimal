import { Bundle } from '../state.spec';
import { FileSystemClipboardStateModel } from './clipboard';

import { prepare } from '../state.spec';

import 'jest-extended';

// @see __mocks__/ngx-electron
// @see __mocks__/actions

const state: FileSystemClipboardStateModel = {
  op: 'clear',
  paths: []
};

describe('FileSystemClipboardState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.fileSystemClipboard.setState(state);
  });

  test('update', () => {
    bundle.fileSystemClipboard.update({ op: 'cut', paths: ['/root'] });
    expect(bundle.fileSystemClipboard.op).toBe('cut');
    expect(bundle.fileSystemClipboard.paths).toEqual(['/root']);
  });

  test('handleActions$/validate', () => {
    bundle.fileSystemClipboard.update({ op: 'copy', paths: ['this', 'that'] });
    expect(bundle.fileSystemClipboard.paths).toEqual(['this', 'that']);
    // now pretend that some file system action has removed 'that'
    bundle.fileSystemClipboard.ngxsOnInit();
    bundle.fileSystemClipboard.electron.ipcRenderer.sendSync = (
      channel,
      path
    ): boolean => path === 'this';
    // NOTE: we cheated and made Actions a Subject rather than an Observable
    bundle.fileSystemClipboard.actions$['next']({
      action: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'FileSystemFilesState.loadPath': true
      },
      status: 'SUCCESSFUL'
    });
    // validate will have removed paths that no longer exist
    expect(bundle.fileSystemClipboard.paths).toEqual(['this']);
  });
});
