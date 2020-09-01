import { getAvailableFonts } from './fonts';

describe('fonts', () => {
  test('getAvailableFonts', async () => {
    const fonts = await getAvailableFonts();
    expect(fonts.length).toBeGreaterThan(1);
  });
});
