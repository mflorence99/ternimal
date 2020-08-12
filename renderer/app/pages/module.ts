import { BarrelModule } from '../barrel';
import { ComponentsModule } from './components/module';
import { ComponentsModule as CommonComponentsModule } from '../components/module';
import { RootComponent } from './root';

import { NgModule } from '@angular/core';

const COMPONENTS = [RootComponent];

const MODULES = [BarrelModule, CommonComponentsModule, ComponentsModule];

@NgModule({
  declarations: [...COMPONENTS],

  imports: [...MODULES]
})
export class PagesModule {}
