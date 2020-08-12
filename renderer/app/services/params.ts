import { Channels } from '../common/channels';

import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

// NOTE: break the rules because we need this statically
const { ipcRenderer } = window.require('electron');

@Injectable({ providedIn: 'root' })
export class Params {
  static homeDir = ipcRenderer.sendSync(Channels.fsHomeDir);
  static initialLayoutID: string = UUID.UUID();
  static initialSplitID: string = UUID.UUID();
  static pathSeparator = ipcRenderer.sendSync(Channels.fsPathSeparator);
  static rootDir = ipcRenderer.sendSync(Channels.fsRootDir);

  led = {
    gap: 3,
    width: 3
  };

  log = {
    colorize: (color): string =>
      `background-color: ${color}; color: white; font-weight: bold; padding: 2px 4px`
  };

  processList = {
    maxTimeline: 5 * 60 * 1000,
    pollInterval: 5000
  };

  rgb = {
    blue: '--google-blue-500',
    green: '--google-green-500',
    red: '--google-red-500',
    yellow: '--google-yellow-500'
  };

  snackBarDuration = 2000;

  systemInfoPollInterval = 1000;

  table = {
    intersection: {
      rootMargin: '24px',
      threshold: 0
    },
    sortDownArrow: '\u2B9F',
    sortUpArrow: '\u2B9D',
    verticalThreshold: 80
  };

  tabsMoveInterval = 250;
}
