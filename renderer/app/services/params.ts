
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

@Injectable({ providedIn: 'root' })
export class Params {

  static uuid: string = UUID.UUID();

  led = {
    gap: 3,
    width: 3
  };

  log = {
    colorize: (color): string => `background-color: ${color}; color: white; font-weight: bold; padding: 2px 4px`
  };

  // TODO: Windows??
  pathSeparator = '/';

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
