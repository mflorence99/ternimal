import { NumeralPipe } from '../../pipes/numeral';
import { TerminalPrefsComponent } from './prefs';

import { prepare } from '../widget.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('TerminalPrefsComponent', () => {
  let component: TerminalPrefsComponent;
  let fixture: ComponentFixture<TerminalPrefsComponent>;

  beforeEach(() => {
    prepare();
    // @see https://stackoverflow.com/questions/41543374
    TestBed.configureTestingModule({
      declarations: [TerminalPrefsComponent, NumeralPipe]
    });
    fixture = TestBed.createComponent(TerminalPrefsComponent);
    component = fixture.componentInstance;
  });

  test('component', () => {
    expect(component).toBeTruthy();
  });
});
