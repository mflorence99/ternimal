import { BarrelModule } from '../barrel';
import { ComponentsModule } from './module';

import { states } from '../state/app';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';

export function prepare(): void {
  TestBed.configureTestingModule({
    imports: [
      BarrelModule,
      ComponentsModule,
      NgxsModule.forRoot(states),
      NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN])
    ],
    providers: [
      // TODO: need some real objects here
      { provide: MAT_DIALOG_DATA, useValue: {} },
      { provide: MatDialogRef, useValue: {} }
    ]
  }).compileComponents();
}

describe('Components tests helpers', () => {
  test('Dummy test', () => {
    expect(true).toBeTruthy();
  });
});
