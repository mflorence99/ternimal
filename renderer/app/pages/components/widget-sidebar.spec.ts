import { WidgetSidebarComponent } from './widget-prefs';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('WidgetSidebarComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(WidgetSidebarComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
