// @see https://github.com/thymikee/jest-preset-angular/

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});

// @see https://github.com/angular/material2/issues/7101
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  }
});

Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: () => {}
});

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

Object.defineProperty(window, 'IntersectionObserver', {
  value: class {
    observe(): any {}
    unobserve(): any {}
  }
});

Object.defineProperty(window, 'ResizeObserver', {
  value: class {
    observe(): any {}
    unobserve(): any {}
  }
});
