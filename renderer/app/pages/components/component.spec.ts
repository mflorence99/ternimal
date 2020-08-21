import { BarrelModule } from '../../barrel';
import { ComponentsModule } from './module';
import { ComponentsModule as CommonComponentsModule } from '../../components/module';
import { DirectivesModule } from '../directives/module';
import { DirectivesModule as CommonDirectivesModule } from '../../directives/module';

import { states } from '../../state/app';

import { ContextMenuService } from 'ngx-contextmenu';
import { ElectronService } from 'ngx-electron';
import { ElementRef } from '@angular/core';
import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';

// @see https://stackoverflow.com/questions/38623065
export class MockElementRef extends ElementRef {
  constructor() {
    super(null);
  }
}

export function prepare(): void {
  TestBed.configureTestingModule({
    imports: [
      BarrelModule,
      CommonComponentsModule,
      CommonDirectivesModule,
      ComponentsModule,
      DirectivesModule,
      NgxsModule.forRoot(states),
      NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN])
    ],
    providers: [
      ContextMenuService,
      { provide: ElementRef, useValue: new MockElementRef() }
    ]
  }).compileComponents();

  const electron = TestBed.inject(ElectronService);
  (electron.ipcRenderer.on as any).mockReset();
  (electron.ipcRenderer.send as any).mockReset();
  (electron.ipcRenderer.sendSync as any).mockReset();
}

describe('Components tests helpers', () => {
  test('Dummy test', () => {
    expect(true).toBeTruthy();
  });
});
