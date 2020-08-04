import { ElementRef } from '@angular/core';
import { Injectable } from '@angular/core';

import rfdc from 'rfdc';

@Injectable({ providedIn: 'root' })
export class Utils {

  private clone = rfdc();

  colorOf(element: ElementRef, nm: string, opacity: number): string {
    const style = window.getComputedStyle(element.nativeElement);
    const color = style.getPropertyValue(nm);
    if (opacity === 0)
      return 'rgba(0, 0, 0, 0)';
    else if (opacity === 1)
      return color.trim();
    else {
      // TODO: assumes variable is in hex format
      let a = Math.round(255 * opacity).toString(16);
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

  merge(...objs: any[]): any {
    return objs
      .filter(obj => !!obj)
      .reduce((acc, obj) => {
        for (const key in obj) {
          if (obj[key] != null)
            acc[key] = obj[key];
        }
        return acc;
      }, { });
  }

  nextTick(fn: Function): void {
    setTimeout(fn, 0);
  }

}
