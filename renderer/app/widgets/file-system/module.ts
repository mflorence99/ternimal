import { BarrelModule } from '../../barrel';
import { ComponentsModule as CommonComponentsModule } from '../../components/module';
import { FileSystemComponent } from './root';

import { NgModule } from '@angular/core';

const COMPONENTS = [
  FileSystemComponent
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
