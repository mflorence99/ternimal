import { NumeralPipe } from '../../pipes/numeral';
import { ProcessListPrefsComponent } from './prefs';

import { prepare } from '../widget.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('ProcessListPrefsComponent', () => {
  let component: ProcessListPrefsComponent;
  let fixture: ComponentFixture<ProcessListPrefsComponent>;

  beforeEach(() => {
    prepare();
    // @see https://stackoverflow.com/questions/41543374
    TestBed.configureTestingModule({
      declarations: [ProcessListPrefsComponent, NumeralPipe]
    });
    fixture = TestBed.createComponent(ProcessListPrefsComponent);
    component = fixture.componentInstance;
  });

  test('component', () => {
    expect(component).toBeTruthy();
  });
});
