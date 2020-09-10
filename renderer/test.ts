import 'jest-preset-angular';

// TODO: why are all these here and what do they mean?

Object.defineProperty(window, 'CSS', { value: null });

Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      appearance: ['-webkit-appearance'],
      display: 'none',
      getPropertyValue: (): string => '#123456'
    };
  }
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});

Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  }
});
