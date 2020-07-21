import { Injectable } from '@angular/core';

import rfdc from 'rfdc';

@Injectable({ providedIn: 'root' })
export class Utils {

  private clone = rfdc();

  deepCopy(obj: any): any {
    return this.clone(obj);
  }

  nextTick(fn: Function): void {
    setTimeout(fn, 0);
  }

}
