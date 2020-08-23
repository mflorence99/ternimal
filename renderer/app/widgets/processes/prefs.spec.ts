import { ProcessListPrefsComponent } from './prefs';

import { prepare } from '../widget.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('ProcessListPrefsComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(ProcessListPrefsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
