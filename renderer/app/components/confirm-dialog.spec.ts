import { ConfirmDialogComponent } from './confirm-dialog';
import { ConfirmDialogModel } from './confirm-dialog';

import { prepare } from './component.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
  });

  test('model', () => {
    const model = new ConfirmDialogModel('t', 'm');
    expect(model.title).toBe('t');
    expect(model.message).toBe('m');
  });

  test('confirm', () => {
    component.confirm();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(component.dialogRef.close).toHaveBeenCalledWith(true);
  });

  test('dismiss', () => {
    component.dismiss();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(component.dialogRef.close).toHaveBeenCalledWith(false);
  });

  test('snapshot', () => {
    component.message = 'A message';
    component.title = 'A title';
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
