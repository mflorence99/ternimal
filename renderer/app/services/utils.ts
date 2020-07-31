import { ElementRef } from '@angular/core';
import { Injectable } from '@angular/core';

import rfdc from 'rfdc';

@Injectable({ providedIn: 'root' })
export class Utils {

  private clone = rfdc();

  colorOf(element: ElementRef, nm: string, tx: number): string {
    const style = window.getComputedStyle(element.nativeElement);
    const color = style.getPropertyValue(nm);
    if (tx === 0)
      return 'rgba(0, 0, 0, 0)';
    else if (tx === 1)
      return color.trim();
    else {
      // TODO: assumes variable is in hex format
      let a = Math.round(255 * tx).toString(16);
      a = (a.length === 1) ? ('0' + a) : a;
      return `${color}${a}`.trim();
    }
  }

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
