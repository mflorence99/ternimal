import { SparklineComponent } from './sparkline';

import { prepare } from './component.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('SparklineComponent', () => {
  let component: SparklineComponent;
  let fixture: ComponentFixture<SparklineComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(SparklineComponent);
    component = fixture.componentInstance;
  });

  test('sparkline accessor / ngOnInit', () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    component.sparkline = { data, labels };
    component.ngOnInit();
    expect(component.chart.data.labels).toEqual(labels);
    // segments divided into red/yellow/green depending on thresholds
    const green = [10, 20, 30, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
    const yellow = [NaN, NaN, NaN, 40, 50, 60, NaN, NaN, NaN, NaN];
    const red = [NaN, NaN, NaN, NaN, NaN, NaN, 70, 80, 90, 100];
    expect(component.chart.data.datasets[0].data).toEqual(green);
    expect(component.chart.data.datasets[1].data).toEqual(yellow);
    expect(component.chart.data.datasets[2].data).toEqual(red);
  });

  test('snapshot', () => {
    const data = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const labels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    component.sparkline = { data, labels };
    component.ngOnInit();
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
