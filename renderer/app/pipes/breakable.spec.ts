import { BreakablePipe } from './breakable';

describe('BreakablePipe', () => {
  test('breakable', () => {
    const breakable = new BreakablePipe();
    expect(breakable.transform('a,b,c,d,e')).toEqual(
      'a\u200b,b\u200b,c\u200b,d\u200b,e'
    );
  });

  test('unbreakable', () => {
    const breakable = new BreakablePipe();
    expect(breakable.transform('abcde', 2)).toEqual('ab\u200bcd\u200be');
  });
});
