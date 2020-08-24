import { TerminalPrefsComponent } from './prefs';

import { prepare } from '../widget.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('TerminalPrefsComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(TerminalPrefsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
