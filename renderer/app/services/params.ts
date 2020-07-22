
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

@Injectable({ providedIn: 'root' })
export class Params {

  static uuid: string = UUID.UUID();

  led = {
    gap: 3,
    green: 'var(--google-green-500)',
    red: 'var(--google-red-500)',
    width: 3,
    yellow: 'var(--google-yellow-500)',
  };

  systemInfoPollInterval = 1000;
  
}
