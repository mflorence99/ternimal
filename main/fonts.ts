/* eslint-disable @typescript-eslint/no-misused-promises */
import { Channels } from './common';

import * as electron from 'electron';

import fontList = require('font-list');

const { ipcMain } = electron;

export const getAvailableFonts = async (): Promise<string[]> => {
  return (await fontList.getFonts()).map((font) => font.replace(/"/g, ''));
};

ipcMain.on(
  Channels.getAvailableFonts,
  async (event: Event): Promise<void> => {
    event.returnValue = (await getAvailableFonts()) as any;
  }
);
