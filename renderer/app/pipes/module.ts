import { BreakablePipe } from './breakable';
import { NumeralPipe } from './numeral';
import { RangePipe } from './range';

import { NgModule } from '@angular/core';

const PIPES = [
  BreakablePipe,
  NumeralPipe,
  RangePipe
];

@NgModule({

  declarations: [
    ...PIPES
  ],

  exports: [
    ...PIPES
  ]

})

export class PipesModule { }
