import { ConfirmDialogComponent } from './confirm-dialog';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('ConfirmDialogComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(ConfirmDialogComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
