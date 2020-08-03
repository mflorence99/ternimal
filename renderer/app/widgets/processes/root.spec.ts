import { ProcessListComponent } from './root';

import { prepare } from '../widget.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('ProcessListComponent', () => {

  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(ProcessListComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
