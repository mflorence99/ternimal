import { TabsComponent } from './tabs';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('TabsComponent', () => {

  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(TabsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
