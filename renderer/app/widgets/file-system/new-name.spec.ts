import { FileSystemRenameComponent } from './rename';

import { prepare } from '../widget.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('FileSystemRenameComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(FileSystemRenameComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
