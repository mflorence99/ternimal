import { BarrelModule } from '../barrel';
import { ComponentsModule as CommonComponentsModule } from '../components/module';
import { DirectivesModule as CommonDirectivesModule } from '../directives/module';
import { FileSystemModule } from './file-system/module';
import { ProcessesModule } from './processes/module';
import { TerminalModule } from './terminal/module';

import { NgModule } from '@angular/core';

const MODULES = [
  BarrelModule,
  CommonComponentsModule,
  CommonDirectivesModule,
  FileSystemModule,
  ProcessesModule,
  TerminalModule
];

@NgModule({
  imports: [...MODULES]
})
export class WidgetsModule {}
