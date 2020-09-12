import { FileSystemComponent } from './root';

import { prepare } from '../widget.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('FileSystemComponent', () => {
  let component: FileSystemComponent;
  let fixture: ComponentFixture<FileSystemComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(FileSystemComponent);
    component = fixture.componentInstance;
  });

  test('component', () => {
    expect(component).toBeTruthy();
  });
});
