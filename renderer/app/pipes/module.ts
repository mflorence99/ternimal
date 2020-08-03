import { RangePipe } from './range';

import { NgModule } from '@angular/core';

const PIPES = [
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
