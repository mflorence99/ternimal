import { BarrelModule } from '../barrel';
import { ConfirmDialogComponent } from './confirm-dialog';
import { EqGaugeComponent } from './eq-gauge';
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
    BarrelModule
  ]

})

export class ComponentsModule { }
