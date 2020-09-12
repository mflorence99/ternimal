import { FileSystemPrefsComponent } from './prefs';
import { NumeralPipe } from '../../pipes/numeral';

import { prepare } from '../widget.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('FileSystemPrefsComponent', () => {
  let component: FileSystemPrefsComponent;
  let fixture: ComponentFixture<FileSystemPrefsComponent>;

  beforeEach(() => {
    prepare();
    // @see https://stackoverflow.com/questions/41543374
    TestBed.configureTestingModule({
      declarations: [FileSystemPrefsComponent, NumeralPipe]
    });
    fixture = TestBed.createComponent(FileSystemPrefsComponent);
    component = fixture.componentInstance;
  });

  test('component', () => {
    expect(component).toBeTruthy();
  });
});
