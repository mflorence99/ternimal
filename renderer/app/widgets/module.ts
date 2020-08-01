import { BarrelModule } from '../barrel';
import { ComponentsModule as CommonComponentsModule } from '../components/module';
import { PipesModule } from '../pipes/module';
import { PlaceholderComponent } from './placeholder';
import { ProcessesComponent } from './processes';

import { NgModule } from '@angular/core';

const COMPONENTS = [
  PlaceholderComponent,
  ProcessesComponent
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
