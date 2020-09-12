import { TabPrefsComponent } from './tab-prefs';

import { prepare } from '../page.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('TabPrefsComponent', () => {
  let component: TabPrefsComponent;
  let fixture: ComponentFixture<TabPrefsComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(TabPrefsComponent);
    component = fixture.componentInstance;
  });

  test('component', () => {
    expect(component).toBeTruthy();
  });
});
