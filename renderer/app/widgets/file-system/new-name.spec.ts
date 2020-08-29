import { FileSystemNewNameComponent } from './new-name';

import { prepare } from '../widget.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('FileSystemNewNameComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(FileSystemNewNameComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
