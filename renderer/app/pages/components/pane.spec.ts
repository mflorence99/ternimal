import { PaneComponent } from './pane';

import { prepare } from '../page.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('RootComponent', () => {
  let component: PaneComponent;
  let fixture: ComponentFixture<PaneComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(PaneComponent);
    component = fixture.componentInstance;
  });
});
