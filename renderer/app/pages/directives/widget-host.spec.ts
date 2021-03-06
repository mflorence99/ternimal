import { WidgetHostDirective } from './widget-host';

import 'jest-extended';

import { ViewContainerRef } from '@angular/core';

describe('WidgetHostDirective', () => {
  test('directive is created', () => {
    const vcf = {} as ViewContainerRef;
    const widgetHost = new WidgetHostDirective(vcf);
    expect(widgetHost).toBeTruthy();
  });
});
