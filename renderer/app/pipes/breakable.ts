import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

@Pipe({ name: 'ternimalBreakable' })

export class BreakablePipe implements PipeTransform {

  transform(s: string, dflt = ''): string {
    if (s == null)
      return dflt;
    else if (typeof s.replace === 'function')
      return s.replace(/([/;:)\]}^.,_%])/g, '\u200b$1');
    else return s;
  }

}
