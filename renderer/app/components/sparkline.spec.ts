import { SparklineComponent } from './sparkline';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('SparklineComponent', () => {

  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(SparklineComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
