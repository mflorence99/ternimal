
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

@Injectable({ providedIn: 'root' })
export class Params {

  static uuid: string = UUID.UUID();

  systemInfoPollInterval = 1000;
  
}
