import { BarrelModule } from '../../barrel';
import { ComponentsModule as CommonComponentsModule } from '../../components/module';
import { HeaderComponent } from './header';
import { PipesModule } from '../../pipes/module';
import { SystemInfoComponent } from './system-info';
import { TabPrefsComponent } from './tab-prefs';
import { TabsComponent } from './tabs';
import { ToolbarComponent } from './toolbar';

import { NgModule } from '@angular/core';

/**
 * All our components
 */

const COMPONENTS = [
  HeaderComponent,
  SystemInfoComponent,
  TabPrefsComponent,
  TabsComponent,
  ToolbarComponent
];

@NgModule({

  declarations: [
    ...COMPONENTS
  ],

  exports: [
    ...COMPONENTS
  ],

  imports: [
    BarrelModule,
    CommonComponentsModule,
    PipesModule
  ]

})

export class ComponentsModule { }