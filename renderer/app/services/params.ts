import { Channels } from '../common';

import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

// TODO: break the rules because we need this statically
// but it only works when running live, not when running Jest tests
let ipcRenderer;
try {
  ipcRenderer = window.require('electron').ipcRenderer;
} catch (error) {
  // TODO: find a way to re-use __mocks__/ngx-electron
  ipcRenderer = {
    on: (): void => {},
    send: (): void => {},
    sendSync: (channel): string => {
      if (channel === Channels.fsHomeDir) return '/home/mflo';
      else if (channel === Channels.fsPathSeparator) return '/';
      else if (channel === Channels.fsRootDir) return '/';
    }
  };
}

@Injectable({ providedIn: 'root' })
export class Params {
  static homeDir = ipcRenderer.sendSync(Channels.fsHomeDir);
  static initialLayoutID: string = UUID.UUID();
  static initialSplitID: string = UUID.UUID();
  static pathSeparator = ipcRenderer.sendSync(Channels.fsPathSeparator);
  static rootDir = ipcRenderer.sendSync(Channels.fsRootDir);

  // NOTE: default built-in font
  static xtermFontFamily = 'Roboto Mono';

  draggableAfter = 1000;

  fileSystemPasteDelay = 500;

  led = {
    gap: 3,
    width: 3
  };

  log = {
    colorize: (color): string =>
      `background-color: ${color}; color: white; font-weight: bold; padding: 2px 4px`
  };

  maxPieWedges = 7;

  prefsDebounceTime = 1000;

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

  splitterDebounceTime = 600;

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

  // crap! need this statically and via service
  xtermFontFamily = Params.xtermFontFamily;
}
