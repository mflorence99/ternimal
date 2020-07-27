
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
    green: 'var(--google-green-500)',
    red: 'var(--google-red-500)',
    width: 3,
    yellow: 'var(--google-yellow-500)',
  };

  systemInfoPollInterval = 1000;

  tabsMoveInterval = 250;
  
}
