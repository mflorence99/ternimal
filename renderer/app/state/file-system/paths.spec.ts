import { Bundle } from '../state.spec';

import { prepare } from '../state.spec';

describe('FileSystemPathsState', () => {

  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.fileSystemPaths.setState({ });
  });

  test('dummy', () => {
    expect(true).toBe(true);
  });

});
