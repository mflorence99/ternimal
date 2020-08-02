import { FileSystemComponent } from './file-system';

import { prepare } from './widget.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('FileSystemComponent', () => {

  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(FileSystemComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

});
