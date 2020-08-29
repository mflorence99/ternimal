import { BarrelModule } from '../../barrel';
import { ComponentsModule as CommonComponentsModule } from '../../components/module';
import { DirectivesModule as CommonDirectivesModule } from '../../directives/module';
import { TerminalComponent } from './root';
import { TerminalPrefsComponent } from './prefs';
import { TerminalPreviewComponent } from './preview';

import { NgModule } from '@angular/core';

const COMPONENTS = [
  TerminalComponent,
  TerminalPrefsComponent,
  TerminalPreviewComponent
];

const MODULES = [BarrelModule, CommonComponentsModule, CommonDirectivesModule];

@NgModule({
  declarations: [...COMPONENTS],

  exports: [...COMPONENTS],

  imports: [...MODULES]
})
export class TerminalModule {}
