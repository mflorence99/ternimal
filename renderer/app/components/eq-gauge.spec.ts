import { EqGaugeComponent } from './eq-gauge';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('EqGaugeComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(EqGaugeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  test('count is calculated correctly', () => {
    const fixture = TestBed.createComponent(EqGaugeComponent);
    const component = fixture.componentInstance;
    component.handleResize({ contentRect: { width: 80 } } as any);
    expect(component.count).toBe(13);
  });

  test('color is calculated correctly', () => {
    const fixture = TestBed.createComponent(EqGaugeComponent);
    const component = fixture.componentInstance;
    component.handleResize({ contentRect: { width: 80 } } as any);
    expect(component.count).toBe(13);
    component.value = 0.85;
    expect(component.color(0)).toBe(`var(${component.params.rgb.green})`);
    expect(component.color(5)).toBe(`var(${component.params.rgb.yellow})`);
    expect(component.color(10)).toBe(`var(${component.params.rgb.red})`);
    expect(component.color(12)).toBe('var(--mat-grey-800)');
  });
});
