import { SparklineComponent } from './sparkline';

import { prepare } from './component.spec';

import 'jest-extended';

import { TestBed } from '@angular/core/testing';

describe('SparklineComponent', () => {
  let component: SparklineComponent;

  beforeEach(() => {
    prepare();
    const fixture = TestBed.createComponent(SparklineComponent);
    component = fixture.componentInstance;
  });

  test('sparkline accessor / ngOnInit', () => {
    component.sparkline = {
      data: [1, 2],
      labels: ['1', '2']
    };
    component.ngOnInit();
    expect(component.chart.data.labels).toEqual(['1', '2']);
  });
});
