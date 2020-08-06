import { Bundle } from '../state.spec';

import { prepare } from '../state.spec';

describe('FileSystemFilesState', () => {

  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.fileSystemFiles.setState({ });
  });

  test('dummy', () => {
    expect(true).toBe(true);
  });

});
