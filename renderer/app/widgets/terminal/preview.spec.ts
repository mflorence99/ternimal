import { TerminalPreviewComponent } from './preview';

import { prepare } from '../widget.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('TerminalPreviewComponent', () => {
  let component: TerminalPreviewComponent;
  let fixture: ComponentFixture<TerminalPreviewComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(TerminalPreviewComponent);
    component = fixture.componentInstance;
  });

  test('component', () => {
    expect(component).toBeTruthy();
  });
});
