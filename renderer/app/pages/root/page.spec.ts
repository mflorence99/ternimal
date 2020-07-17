import { BarrelModule } from '../../barrel';
import { RootPageComponent } from './page';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('RootPageComponent', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        RootPageComponent
      ],
      imports: [
        BarrelModule
      ]
    }).compileComponents();

  }));

  test('App is created', () => {
    const fixture = TestBed.createComponent(RootPageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
