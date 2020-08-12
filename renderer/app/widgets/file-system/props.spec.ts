import { FileSystemPropsComponent } from './props';

import { prepare } from '../widget.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('FileSystemPropsComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(FileSystemPropsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
