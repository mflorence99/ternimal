import { Injectable } from '@angular/core';

import rfdc from 'rfdc';

@Injectable({ providedIn: 'root' })
export class Utils {

  private clone = rfdc();

  deepCopy(obj: any): any {
    return this.clone(obj);
  }

  hasProperty(obj: any, property: string | RegExp): boolean {
    return Object.keys(obj).some(key => {
      if (typeof property === 'string')
        return key === property;
      else return property.test(key);
    });
  }

  nextTick(fn: Function): void {
    setTimeout(fn, 0);
  }

}
