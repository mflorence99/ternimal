import { BarrelModule } from '../../barrel';
import { RootPageComponent } from './page';

import { NgModule } from '@angular/core';

/**
 * Root page module
 */

const COMPONENTS = [
  RootPageComponent
];

const MODULES = [
  BarrelModule
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
