import { IconsModule } from './icons';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ContextMenuModule } from 'ngx-contextmenu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { NgxResizeObserverModule } from 'ngx-resize-observer';
import { ReactiveFormsModule } from '@angular/forms';

const MODULES = [
  BrowserAnimationsModule,
  BrowserModule,
  ContextMenuModule,
  DragDropModule,
  FontAwesomeModule,
  FormsModule,
  IconsModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatInputModule,
  MatMenuModule,
  MatRippleModule,
  MatSidenavModule,
  MatTooltipModule, 
  NgxResizeObserverModule,
  ReactiveFormsModule
];

@NgModule({

  imports: [
    ...MODULES
  ],

  exports: [
    ...MODULES
  ],

})

export class BarrelModule { }
