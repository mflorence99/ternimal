import { DestroyService } from '../../services/destroy';
import { SelectionState } from '../../state/selection';
import { TabsState } from '../../state/tabs';
import { Utils } from '../../services/utils';

import { Actions } from '@ngxs/store';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { debounceTime } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DestroyService],
  selector: 'ternimal-tab-prefs',
  templateUrl: 'tab-prefs.html',
  styleUrls: ['tab-prefs.scss']
})

export class TabPrefsComponent implements OnInit {

  colors = [
    'var(--mat-grey-100)',
    'var(--mat-grey-400)',
    'var(--mat-blue-grey-100)',
    'var(--mat-blue-grey-400)',

    'var(--mat-blue-500)',
    'var(--mat-light-blue-500)',
    'var(--mat-cyan-500)',
    'var(--mat-teal-500)',

    'var(--google-green-500)',
    'var(--mat-green-500)',
    'var(--mat-light-green-500)',
    'var(--mat-lime-500)',

    'var(--mat-yellow-500)',
    'var(--mat-amber-500)',
    'var(--mat-orange-500)',
    'var(--mat-deep-orange-500)',

    'var(--mat-red-500)',
    'var(--mat-pink-400)',
    'var(--mat-purple-300)',
    'var(--mat-indigo-300)'
  ];

  icons = [
    'fas laptop',
    'fas home',
    'fas database',
    'fas server',
    'fas code',
    'fas image',
    'fas user-secret',
    'fas trash',
    'fas music',
    'fas video',
    'fas cloud',
    'fas sitemap',
    'fas cog',
    'fab apple',
    'fab aws',
    'fab docker',
    'fab github',
    'fab linux',
    'fab node-js',
    'fab windows'
  ];

  splitIcons = this.icons.map(icon => icon.split(' '));

  tabPrefsForm: FormGroup;

  constructor(private actions$: Actions,
              private destroy$: DestroyService,
              private formBuilder: FormBuilder,
              public tabs: TabsState,
              private selection: SelectionState,
              private utils: Utils) { 
    // initialize the form
    this.tabPrefsForm = this.formBuilder.group({
      color: [this.tabs.tab.color, Validators.required],
      icon: [this.tabs.tab.icon.join(' '), Validators.required],
      label: [this.tabs.tab.label, Validators.required]
    });
    // handle changes in selection
    this.handleActions$();
  }

  clear(nm: string): void {
    this.tabPrefsForm.patchValue({ [nm]: '' });
  }

  ngOnInit(): void {
    this.tabPrefsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(tabPrefsForm => {
        this.tabs.update({ tab: { 
          ...tabPrefsForm, 
          icon: tabPrefsForm.icon.split(' '),
          layoutID: this.selection.layoutID } });
      });
  }

  // private methods

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return this.utils.hasProperty(action, 'SelectionState.selectLayout')
            && (status === 'SUCCESSFUL');
        }),
        debounceTime(0),
        takeUntil(this.destroy$)
      )
      .subscribe(_ => {
        this.tabPrefsForm.patchValue({ 
          color: this.tabs.tab.color,
          icon: this.tabs.tab.icon.join(' '),
          label: this.tabs.tab.label
        });
      });
  }

}
