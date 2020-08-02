import { BarrelModule } from '../barrel';
import { ComponentsModule as CommonComponentsModule } from '../components/module';
import { PipesModule } from '../pipes/module';
import { ProcessesComponent } from './processes';
import { TerminalComponent } from './terminal';

import { NgModule } from '@angular/core';

const COMPONENTS = [
  ProcessesComponent,
  TerminalComponent
];

const MODULES = [
  BarrelModule,
  CommonComponentsModule,
  PipesModule
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

export class WidgetsModule { }
