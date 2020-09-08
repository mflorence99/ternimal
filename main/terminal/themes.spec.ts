import './themes';

import { Channels } from '../common';

import { on } from '../common';

import 'jest-extended';

// @see __mocks__/electron.ts

describe('themes', () => {
  const event = {
    returnValue: null
  };

  beforeEach(() => {
    event.returnValue = null;
  });

  test('getAvailableThemes', () => {
    on(Channels.getAvailableThemes)(event);
    const themes = event.returnValue;
    expect(themes.length).toBeGreaterThan(1);
    expect(themes).toContain('3024 Day');
    expect(themes).toContain('Zenburn');
  });

  test('loadTheme', () => {
    on(Channels.loadTheme)(event, '(Built-in Theme)');
    const theme = event.returnValue;
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
