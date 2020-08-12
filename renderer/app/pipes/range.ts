import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

/**
 * @see https://stackoverflow.com/questions/46805343
 */

@Pipe({ name: 'ternimalRange' })
export class RangePipe implements PipeTransform {
  transform(length: number, offset = 0): number[] {
    const array = [];
    for (let n = 0; n < length; ++n) {
      array.push(offset + n);
    }
    return array;
  }
}
