import { BarrelModule } from '../barrel';
import { ComponentsModule } from './components/module';
import { RootComponent } from './root';

import { states } from '../state/app';

import { ContextMenuService } from 'ngx-contextmenu';
import { ElementRef } from '@angular/core';
import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

// @see https://stackoverflow.com/questions/38623065
export class MockElementRef extends ElementRef {
  constructor() {
    super(null);
  }
}

describe('RootComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RootComponent],
      imports: [
        BarrelModule,
        ComponentsModule,
        NgxsModule.forRoot(states),
        NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN])
      ],
      providers: [
        ContextMenuService,
        { provide: ElementRef, useValue: new MockElementRef() }
      ]
    }).compileComponents();
  }));

  test('App is created', () => {
    const fixture = TestBed.createComponent(RootComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
