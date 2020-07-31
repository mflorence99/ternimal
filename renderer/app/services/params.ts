
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

@Injectable({ providedIn: 'root' })
export class Params {

  static uuid: string = UUID.UUID();

  conFirmTabRemoval = {
    message: 'Are you sure you want to proceed? This operation cannot be undone and all sessions will be terminated.',
    title: 'Confirm Tab Removal'
  };

  led = {
    gap: 3,
    width: 3
  };

  processList = {
    maxTimeline: 5 * 60 * 1000,
    pollInterval: 5000
  };

  rgb = {
    green: '--google-green-500',
    red: '--google-red-500',
    yellow: '--google-yellow-500'
  };

  systemInfoPollInterval = 1000;

  table = {
    verticalThreshold: 100
  };

  tabsMoveInterval = 250;
  
}
