import { TriStateComponent } from './tristate';

import { prepare } from './component.spec';

import 'jest-extended';

import { TestBed } from '@angular/core/testing';

describe('TriStateComponent', () => {
  let component: TriStateComponent;

  beforeEach(() => {
    prepare();
    const fixture = TestBed.createComponent(TriStateComponent);
    component = fixture.componentInstance;
  });

  test('writeValue / next', () => {
    component.writeValue(null);
    expect(component.value).toBeNull();
    component.registerOnChange((value) => expect(value).toBeTrue());
    component.registerOnTouched((value) => expect(value).toBeTrue());
    component.next();
  });

  test('disabled state', () => {
    expect(component.disabled).toBeFalse();
    component.setDisabledState(true);
    expect(component.disabled).toBeTrue();
  });
});
