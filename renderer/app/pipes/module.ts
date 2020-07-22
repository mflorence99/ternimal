import { BarrelModule } from '../barrel';
import { RangePipe } from './range';

import { NgModule } from '@angular/core';

/**
 * All our pipes
 */

const PIPES = [
  RangePipe
];

@NgModule({

  declarations: [
    ...PIPES
  ],

  exports: [
    ...PIPES
  ],

  imports: [
    BarrelModule
  ]

})

export class PipesModule { }
