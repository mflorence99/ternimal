import './process-list';

import { Channels } from './common';

import { processListKill } from './process-list';
import { processListRequest } from './process-list';

import 'jest-extended';

import * as electron from 'electron';

// @see __mocks__/electron.ts

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
    expect(theWindow.webContents.send).toHaveBeenCalledWith(
      Channels.processListResponse,
      expect.any(Array)
    );
  });
});
