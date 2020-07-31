import { TableComponent } from './table';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('TableComponent', () => {

  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(TableComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
