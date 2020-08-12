import { TriStateComponent } from './tristate';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('TriStateComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(TriStateComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
