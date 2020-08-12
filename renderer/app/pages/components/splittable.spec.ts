import { SplittableComponent } from './splittable';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('SplittableComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(SplittableComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
