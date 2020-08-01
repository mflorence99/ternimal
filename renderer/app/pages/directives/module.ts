import { BarrelModule } from '../../barrel';
import { WidgetHostDirective } from './widget-host';

import { NgModule } from '@angular/core';

const DIRECTIVES = [
  WidgetHostDirective
];

@NgModule({

  declarations: [
    ...DIRECTIVES
  ],

  exports: [
    ...DIRECTIVES
  ],

  imports: [
    BarrelModule
  ]

})

export class DirectivesModule { }
