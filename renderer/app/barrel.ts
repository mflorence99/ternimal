import { IconsModule } from './icons';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { NgxResizeObserverModule } from 'ngx-resize-observer';
import { ReactiveFormsModule } from '@angular/forms';

const MODULES = [
  BrowserAnimationsModule,
  BrowserModule,
  ContextMenuModule,
  FontAwesomeModule,
  FormsModule,
  IconsModule,
  MatButtonModule,
  MatRippleModule,
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
