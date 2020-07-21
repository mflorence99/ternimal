import { BarrelModule } from '../../barrel';
import { ComponentsModule } from '../components/module';
import { RootPageComponent } from './page';

import { states } from '../../state/app';

import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('RootPageComponent', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        RootPageComponent
      ],
      imports: [
        BarrelModule,
        ComponentsModule,
        NgxsModule.forRoot(states),
        NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN]),
      ]
    }).compileComponents();

  }));

  test('App is created', () => {
    const fixture = TestBed.createComponent(RootPageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
