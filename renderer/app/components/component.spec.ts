import { BarrelModule } from '../barrel';
import { ComponentsModule } from './module';
import { MockActions } from '../../__mocks__/actions';
import { MockElectronService } from '../../__mocks__/ngx-electron';
import { MockElementRef } from '../../__mocks__/element-ref';
import { MockMatDialogRef } from '../../__mocks__/mat-dialog-ref';

import { states } from '../state/app';

import { Actions } from '@ngxs/store';
import { ElectronService } from 'ngx-electron';
import { ElementRef } from '@angular/core';
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
      { provide: MAT_DIALOG_DATA, useValue: {} },
      {
        provide: Actions,
        useClass: MockActions
      },
      {
        provide: ElectronService,
        useClass: MockElectronService
      },
      {
        provide: ElementRef,
        useClass: MockElementRef
      },
      {
        provide: MatDialogRef,
        useClass: MockMatDialogRef
      }
    ]
  }).compileComponents();
}

describe('Components tests helpers', () => {
  test('Dummy test', () => {
    expect(true).toBeTruthy();
  });
});
