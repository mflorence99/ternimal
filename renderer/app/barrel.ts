import { IconsModule } from './icons';

import { BrowserModule } from '@angular/platform-browser';
import { ContextMenuModule } from 'ngx-contextmenu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

const MODULES = [
  BrowserModule,
  ContextMenuModule,
  FontAwesomeModule,
  FormsModule,
  IconsModule,
  MatButtonModule,
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
