import { WidgetSidebarComponent } from './widget-sidebar';

import { prepare } from '../page.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('WidgetSidebarComponent', () => {
  let component: WidgetSidebarComponent;
  let fixture: ComponentFixture<WidgetSidebarComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(WidgetSidebarComponent);
    component = fixture.componentInstance;
  });

  test('component', () => {
    expect(component).toBeTruthy();
  });
});
