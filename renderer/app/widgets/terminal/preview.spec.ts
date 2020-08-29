import { TerminalPreviewComponent } from './preview';

import { prepare } from '../widget.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('TerminalPreviewComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(TerminalPreviewComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
