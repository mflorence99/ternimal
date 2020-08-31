import { getAvailableFonts } from './fonts';

describe('fonts', () => {
  test('Smoke test', async () => {
    const fonts = await getAvailableFonts();
    expect(fonts.length).toBeGreaterThan(1);
  });
});
