import { BarrelModule } from '../../barrel';
import { ComponentsModule as CommonComponentsModule } from '../../components/module';
import { TerminalComponent } from './root';

import { NgModule } from '@angular/core';

const COMPONENTS = [
  TerminalComponent
];

const MODULES = [
  BarrelModule,
  CommonComponentsModule
];

@NgModule({

  declarations: [
    ...COMPONENTS
  ],

  exports: [
    ...COMPONENTS
  ],

  imports: [
    ...MODULES
  ]

})

export class TerminalModule { }
