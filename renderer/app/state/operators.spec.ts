import { scratch } from './operators';

describe('operators', () => {
  test('scratch', () => {
    const obj: any = { p: ['warn', 42, true], q: ['off'] };
    const updated = scratch('q')(obj);
    expect(updated.p).toBeTruthy();
    expect(updated.q).toBeFalsy();
  });
});
