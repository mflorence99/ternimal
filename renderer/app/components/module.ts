import { BarrelModule } from '../barrel';
import { ConfirmDialogComponent } from './confirm-dialog';
import { EqGaugeComponent } from './eq-gauge';
import { PipesModule } from '../pipes/module';

import { NgModule } from '@angular/core';

/**
 * All our components
 */

const COMPONENTS = [
  ConfirmDialogComponent,
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
