import { SystemInfoComponent } from './system-info';

import { prepare } from '../page.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('SystemInfoComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(SystemInfoComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
