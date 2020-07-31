import { ProcessesComponent } from './processes';

import { prepare } from './widget.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('ProcessesComponent', () => {

  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(ProcessesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
