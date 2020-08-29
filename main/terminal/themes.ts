import { Channels } from '../common';
import { Theme } from '../common';

import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as YAML from 'yaml';

const { ipcMain } = electron;

const cache: Record<string, Theme> = {};

ipcMain.on(Channels.getAvailableThemes, (event: Event) => {
  const themes = path.join(__dirname, '..', '..', 'themes');
  const names = fs.readdirSync(themes);
  event.returnValue = names
    .map((name) => path.basename(name, '.yml'))
    .sort() as any;
});

ipcMain.on(Channels.loadTheme, (event: Event, nm: string) => {
  let theme = cache[nm];
  if (!theme) {
    const themePath = path.join(__dirname, '..', '..', 'themes', nm + '.yml');
    theme = YAML.parse(fs.readFileSync(themePath).toString());
    cache[nm] = theme;
  }
  event.returnValue = theme as any;
});
