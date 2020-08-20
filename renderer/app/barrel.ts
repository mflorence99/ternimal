import { IconsModule } from './icons';
import { PipesModule } from './pipes/module';

import { AngularSplitModule } from 'angular-split';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ContextMenuModule } from 'ngx-contextmenu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MomentModule } from 'ngx-moment';
import { NgModule } from '@angular/core';
import { NgxResizeObserverModule } from 'ngx-resize-observer';
import { OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';

const MODULES = [
  AngularSplitModule,
  BrowserAnimationsModule,
  BrowserModule,
  ContextMenuModule,
  DragDropModule,
  FontAwesomeModule,
  FormsModule,
  IconsModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatInputModule,
  MatProgressBarModule,
  MatRadioModule,
  MatRippleModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTooltipModule,
  MomentModule,
  NgxResizeObserverModule,
  OverlayModule,
  PipesModule,
  ReactiveFormsModule
];

@NgModule({
  imports: [...MODULES],

  exports: [...MODULES]
})
export class BarrelModule {}
