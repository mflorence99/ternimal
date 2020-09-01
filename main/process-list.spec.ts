import './process-list';

import { ProcessList } from './common';

import { processListKill } from './process-list';
import { processListRequest } from './process-list';

import * as electron from 'electron';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { BrowserWindow } = electron;

describe('process-list', () => {
  let theWindow;

  beforeEach(() => {
    theWindow = new BrowserWindow({});
    globalThis.theWindow = theWindow;
  });

  test('processListKill', () => {
    const mockKill = jest
      .spyOn(process, 'kill')
      .mockImplementation((): any => {});
    processListKill(undefined, [1, 2, 3]);
    expect(mockKill).toHaveBeenCalledTimes(3);
  });

  test('processListRequest', async () => {
    await processListRequest();
    const processList: ProcessList =
      theWindow.webContents.send.mock.calls[0][1];
    expect(processList.length).toBeGreaterThanOrEqual(1);
  });
});
