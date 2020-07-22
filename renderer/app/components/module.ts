import { BarrelModule } from '../barrel';
import { EqGaugeComponent } from './eq-gauge';
import { PipesModule } from '../pipes/module';

import { NgModule } from '@angular/core';

/**
 * All our components
 */

const COMPONENTS = [
  EqGaugeComponent
];

@NgModule({

  declarations: [
    ...COMPONENTS
  ],

  exports: [
    ...COMPONENTS
  ],

  imports: [
    BarrelModule,
    PipesModule
  ]

})

export class ComponentsModule { }
