import { WidgetPrefsComponent } from './widget-prefs';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('WidgetPrefsComponent', () => {

  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(WidgetPrefsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
