import { PaneComponent } from './pane';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('PaneComponent', () => {

  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(PaneComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
