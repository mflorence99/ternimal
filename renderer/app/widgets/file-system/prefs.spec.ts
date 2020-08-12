import { FileSystemPrefsComponent } from './prefs';

import { prepare } from '../widget.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('FileSystemPrefsComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(FileSystemPrefsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
