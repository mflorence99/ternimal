import { FileSystemPropsComponent } from './props';

import { prepare } from '../widget.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('FileSystemPropsComponent', () => {
  let component: FileSystemPropsComponent;
  let fixture: ComponentFixture<FileSystemPropsComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(FileSystemPropsComponent);
    component = fixture.componentInstance;
  });

  test('component', () => {
    expect(component).toBeTruthy();
  });
});
