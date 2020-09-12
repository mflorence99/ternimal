import { TerminalComponent } from './root';

import { prepare } from '../widget.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('TerminalComponent', () => {
  let component: TerminalComponent;
  let fixture: ComponentFixture<TerminalComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(TerminalComponent);
    component = fixture.componentInstance;
  });

  test('component', () => {
    expect(component).toBeTruthy();
  });
});
