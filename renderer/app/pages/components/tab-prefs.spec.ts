import { TabPrefsComponent } from './tab-prefs';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('TabPrefsComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(TabPrefsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
