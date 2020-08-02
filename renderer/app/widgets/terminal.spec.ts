import { TerminalComponent } from './terminal';

import { prepare } from './widget.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('TerminalComponent', () => {

  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(TerminalComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
