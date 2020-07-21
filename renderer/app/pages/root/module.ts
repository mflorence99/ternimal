import { BarrelModule } from '../../barrel';
import { ComponentsModule } from '../components/module';
import { RootPageComponent } from './page';

import { NgModule } from '@angular/core';

/**
 * Root page module
 */

const COMPONENTS = [
  RootPageComponent
];

const MODULES = [
  BarrelModule,
  ComponentsModule
];

@NgModule({

  declarations: [
    ...COMPONENTS
  ],

  imports: [
    ...MODULES
  ]
  
})

export class RootPageModule { }
