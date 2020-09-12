import { FileSystemNewNameComponent } from './new-name';

import { prepare } from '../widget.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('FileSystemNewNameComponent', () => {
  let component: FileSystemNewNameComponent;
  let fixture: ComponentFixture<FileSystemNewNameComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(FileSystemNewNameComponent);
    component = fixture.componentInstance;
  });

  test('component', () => {
    expect(component).toBeTruthy();
  });
});
