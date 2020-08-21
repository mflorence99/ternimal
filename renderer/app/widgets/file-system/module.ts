import { BarrelModule } from '../../barrel';
import { ComponentsModule as CommonComponentsModule } from '../../components/module';
import { DirectivesModule as CommonDirectivesModule } from '../../directives/module';
import { FileSystemComponent } from './root';
import { FileSystemNewNameComponent } from './new-name';
import { FileSystemPrefsComponent } from './prefs';
import { FileSystemPropsComponent } from './props';

import { NgModule } from '@angular/core';

const COMPONENTS = [
  FileSystemComponent,
  FileSystemNewNameComponent,
  FileSystemPrefsComponent,
  FileSystemPropsComponent
];

const MODULES = [BarrelModule, CommonComponentsModule, CommonDirectivesModule];

@NgModule({
  declarations: [...COMPONENTS],

  exports: [...COMPONENTS],

  imports: [...MODULES]
})
export class FileSystemModule {}
