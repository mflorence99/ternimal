import { BarrelModule } from '../barrel';
import { ComponentsModule } from './components/module';
import { ComponentsModule as CommonComponentsModule } from '../components/module';
import { DirectivesModule as CommonDirectivesModule } from '../directives/module';
import { RootComponent } from './root';

import { NgModule } from '@angular/core';

const COMPONENTS = [RootComponent];

const MODULES = [
  BarrelModule,
  CommonComponentsModule,
  CommonDirectivesModule,
  ComponentsModule
];

@NgModule({
  declarations: [...COMPONENTS],

  imports: [...MODULES]
})
export class PagesModule {}
