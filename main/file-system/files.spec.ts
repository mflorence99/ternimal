import './files';

import * as electron from 'electron';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

describe('files', () => {
  let theWindow;

  beforeEach(() => {
    theWindow = new BrowserWindow({});
    globalThis.theWindow = theWindow;
  });
});
