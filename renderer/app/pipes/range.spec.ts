import { RangePipe } from './range';

describe('RangePipe', () => {

  test('creates array', () => {
    const range = new RangePipe();
    expect(range.transform(6, 10)).toEqual([10, 11, 12, 13, 14, 15]);
  });

});
