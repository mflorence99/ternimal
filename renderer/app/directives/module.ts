import { BarrelModule } from '../barrel';
import { DraggableDirective } from './draggable';

import { NgModule } from '@angular/core';

const DIRECTIVES = [DraggableDirective];

@NgModule({
  declarations: [...DIRECTIVES],

  exports: [...DIRECTIVES],

  imports: [BarrelModule]
})
export class DirectivesModule {}
