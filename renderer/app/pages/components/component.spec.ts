import { BarrelModule } from '../../barrel';
import { ComponentsModule } from './module';

import { states } from '../../state/app';

import { ElectronService } from 'ngx-electron';
import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';

declare let lintelVSCodeAPI;

export function prepare(): void {

  TestBed.configureTestingModule({
    imports: [
      BarrelModule,
      ComponentsModule,
      NgxsModule.forRoot(states),
      NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN])
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
