import { Channels } from '../common';
import { Theme } from '../common';

import * as electron from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as YAML from 'yaml';

const { ipcMain } = electron;

const cache: Record<string, Theme> = {};

export const getAvailableThemes = (): string[] => {
  const themes = path.join(__dirname, '..', '..', 'themes');
  const names = fs.readdirSync(themes);
  return names
    .map((name) => path.basename(name, '.yml'))
    .sort((p, q) => p.toLowerCase().localeCompare(q.toLowerCase()));
};

export const loadTheme = (nm: string): Theme => {
  let theme = cache[nm];
  if (!theme) {
    const themePath = path.join(__dirname, '..', '..', 'themes', nm + '.yml');
    theme = YAML.parse(fs.readFileSync(themePath).toString());
    cache[nm] = theme;
  }
  return theme;
};

ipcMain.on(Channels.getAvailableThemes, (event: Event) => {
  event.returnValue = getAvailableThemes() as any;
});

ipcMain.on(Channels.loadTheme, (event: Event, nm: string) => {
  event.returnValue = loadTheme(nm) as any;
});
