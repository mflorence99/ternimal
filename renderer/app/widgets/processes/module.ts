import { BarrelModule } from '../../barrel';
import { ComponentsModule as CommonComponentsModule } from '../../components/module';
import { DirectivesModule as CommonDirectivesModule } from '../../directives/module';
import { ProcessListComponent } from './root';
import { ProcessListPrefsComponent } from './prefs';

import { NgModule } from '@angular/core';

const COMPONENTS = [ProcessListComponent, ProcessListPrefsComponent];

const MODULES = [BarrelModule, CommonComponentsModule, CommonDirectivesModule];

@NgModule({
  declarations: [...COMPONENTS],

  exports: [...COMPONENTS],

  imports: [...MODULES]
})
export class ProcessesModule {}
