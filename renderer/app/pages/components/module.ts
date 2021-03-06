import { BarrelModule } from '../../barrel';
import { ComponentsModule as CommonComponentsModule } from '../../components/module';
import { DirectivesModule } from '../directives/module';
import { DirectivesModule as CommonDirectivesModule } from '../../directives/module';
import { HeaderComponent } from './header';
import { PaneComponent } from './pane';
import { SplittableComponent } from './splittable';
import { SystemInfoComponent } from './system-info';
import { TabPrefsComponent } from './tab-prefs';
import { TabsComponent } from './tabs';
import { ToolbarComponent } from './toolbar';
import { WidgetSidebarComponent } from './widget-sidebar';
import { WidgetsModule } from '../../widgets/module';

import { NgModule } from '@angular/core';

const COMPONENTS = [
  HeaderComponent,
  PaneComponent,
  SplittableComponent,
  SystemInfoComponent,
  TabPrefsComponent,
  TabsComponent,
  ToolbarComponent,
  WidgetSidebarComponent
];

@NgModule({
  declarations: [...COMPONENTS],

  exports: [...COMPONENTS],

  imports: [
    BarrelModule,
    CommonComponentsModule,
    CommonDirectivesModule,
    DirectivesModule,
    WidgetsModule
  ]
})
export class ComponentsModule {}
