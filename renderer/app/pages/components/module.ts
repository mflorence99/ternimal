import { BarrelModule } from '../../barrel';
import { HeaderComponent } from './header';
import { InfoComponent } from './info';
import { TabsComponent } from './tabs';
import { ToolbarComponent } from './toolbar';

import { NgModule } from '@angular/core';

/**
 * All our components
 */

const COMPONENTS = [
  HeaderComponent,
  InfoComponent,
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
    BarrelModule
  ]

})

export class ComponentsModule { }
