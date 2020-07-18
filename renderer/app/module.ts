import { BarrelModule } from './barrel';
import { RootPageComponent } from './pages/root/page';
import { RootPageModule } from './pages/root/module';

import { states } from './state/app';

import { ContextMenuModule } from 'ngx-contextmenu';
import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';
import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';

const COMPONENTS = [];

const MODULES = [
  BarrelModule,
  NgxElectronModule,
  RootPageModule
];

@NgModule({

  bootstrap: [RootPageComponent],

  declarations: [
    ...COMPONENTS
  ],

  imports: [
    ...MODULES,
    ContextMenuModule.forRoot({
      autoFocus: true
    }),
    NgxsModule.forRoot(states, {
      developmentMode: window['DEV_MODE']
    }),
    NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN]),
    NgxsLoggerPluginModule.forRoot({
      collapsed: false,
      logger: console
    })
  ]

})

export class TernimalModule { }
