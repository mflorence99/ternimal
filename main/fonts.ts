/* eslint-disable @typescript-eslint/no-misused-promises */
import { Channels } from './common';

import * as electron from 'electron';

import fontList = require('font-list');

const { ipcMain } = electron;

ipcMain.on(
  Channels.getAvailableFonts,
  async (event: Event): Promise<void> => {
    const fonts = (await fontList.getFonts()).map((font) =>
      font.replace(/"/g, '')
    );
    event.returnValue = fonts as any;
  }
);
