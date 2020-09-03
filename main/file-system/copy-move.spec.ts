import './copy-move';

import * as electron from 'electron';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

describe('copy-move', () => {
  let theWindow;

  beforeEach(() => {
    theWindow = new BrowserWindow({});
    globalThis.theWindow = theWindow;
  });

  test('dummy', () => {
    expect(true).toBe(true);
  });
});
