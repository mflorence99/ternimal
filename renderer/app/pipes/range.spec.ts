import { RangePipe } from './range';

describe('RangePipe', () => {

  test('creates array without offset', () => {
    const range = new RangePipe();
    expect(range.transform(6)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  test('creates array with offset', () => {
    const range = new RangePipe();
    expect(range.transform(6, 10)).toEqual([10, 11, 12, 13, 14, 15]);
  });

});
