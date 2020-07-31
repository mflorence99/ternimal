import { BarrelModule } from '../barrel';
import { ConfirmDialogComponent } from './confirm-dialog';
import { EqGaugeComponent } from './eq-gauge';
import { PipesModule } from '../pipes/module';
import { SparklineComponent } from './sparkline';
import { TableComponent } from './table';

import { NgModule } from '@angular/core';

const COMPONENTS = [
  ConfirmDialogComponent,
  EqGaugeComponent,
  SparklineComponent,
  TableComponent
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
