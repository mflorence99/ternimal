import { getAvailableThemes } from './themes';
import { loadTheme } from './themes';

describe('themes', () => {
  test('getAvailableThemes', () => {
    const themes = getAvailableThemes();
    expect(themes.length).toBeGreaterThan(1);
    expect(themes).toContain('3024 Day');
    expect(themes).toContain('Zenburn');
  });

  test('loadTheme', () => {
    const theme = loadTheme('(Built-in Theme)');
    expect(theme).toEqual({
      colors: {
        primary: {
          background: 'transparent',
          foreground: '#F5F5F5'
        }
      }
    });
  });
});
