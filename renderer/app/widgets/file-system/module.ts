import { BarrelModule } from '../../barrel';
import { ComponentsModule as CommonComponentsModule } from '../../components/module';
import { FileSystemComponent } from './root';
import { FileSystemPrefsComponent } from './prefs';
import { FileSystemPropsComponent } from './props';

import { NgModule } from '@angular/core';

const COMPONENTS = [
  FileSystemComponent,
  FileSystemPrefsComponent,
  FileSystemPropsComponent
];

const MODULES = [
  BarrelModule,
  CommonComponentsModule
];

@NgModule({

  declarations: [
    ...COMPONENTS
  ],

  exports: [
    ...COMPONENTS
  ],

  imports: [
    ...MODULES
  ]

})

export class FileSystemModule { }
