import { Channels } from '../common';

import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';

const { ipcMain } = electron;

ipcMain.on(Channels.getAvailableThemes, (event: Event) => {
  const themes = path.join(__dirname, '..', '..', 'themes');
  const names = fs.readdirSync(themes);
  event.returnValue = names.map((name) => path.basename(name, '.yml')) as any;
});
