import { NumeralPipe } from './numeral';

describe('NumeralPipe', () => {
  test('0b', () => {
    const numeral = new NumeralPipe();
    expect(numeral.transform('21123456', '0b')).toEqual('21MB');
  });

  test('0,0', () => {
    const numeral = new NumeralPipe();
    expect(numeral.transform('21123456', '0,0')).toEqual('21,123,456');
  });

  test('null', () => {
    const numeral = new NumeralPipe();
    expect(numeral.transform(null, '0,0', 'oops')).toEqual('oops');
  });
});
