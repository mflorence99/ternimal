import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

@Pipe({ name: 'ternimalBreakable' })
export class BreakablePipe implements PipeTransform {
  transform(s: string, max?: number): string {
    s = s.replace(/([/;:)\]}^.,_%-])/g, '\u200b$1');
    if (!max) return s;
    return s
      .split('\u200b')
      .flatMap((t) =>
        // @see https://stackoverflow.com/questions/10474992
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        t.length > max ? t.match(RegExp(`(.{1,${max}})`, 'g')) : t
      )
      .join('\u200b');
  }
}
