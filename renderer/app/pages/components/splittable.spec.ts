import { SplittableComponent } from './splittable';

import { prepare } from '../page.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('SplittableComponent', () => {
  let component: SplittableComponent;
  let fixture: ComponentFixture<SplittableComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(SplittableComponent);
    component = fixture.componentInstance;
  });

  test('trackBySplitID', () => {
    expect(component.trackBySplitID(undefined, { id: 'a', size: 50 })).toBe(
      'a'
    );
  });
});
