import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

import numeral from 'numeral';

@Pipe({ name: 'ternimalNumeral' })

export class NumeralPipe implements PipeTransform {

  transform(value: any, fmt: string, dflt = ''): string {
    if (value == null)
      return dflt;
    else return numeral(Number(value)).format(fmt);
  }

}
