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
    ['var(--mat-grey-100)', 'var(--mat-grey-100)'],
    ['var(--mat-grey-400)', 'var(--mat-grey-400)'],
    ['var(--mat-blue-grey-100)', 'var(--mat-blue-grey-100)'],
    ['var(--mat-brown-200)', 'var(--mat-brown-200)'],

    ['var(--mat-red-400)', 'var(--mat-red-400)'],
    ['var(--mat-pink-400)', 'var(--mat-pink-400)'],
    ['var(--mat-purple-400)', 'var(--mat-purple-400)'],
    ['var(--mat-deep-purple-400)', 'var(--mat-deep-purple-400)'],

    ['var(--mat-indigo-400)', 'var(--mat-indigo-400)'],
    ['var(--mat-blue-400)', 'var(--mat-blue-400)'],
    ['var(--mat-light-blue-400)', 'var(--mat-light-blue-400)'],
    ['var(--mat-cyan-400)', 'var(--mat-cyan-400)'],

    ['var(--mat-teal-400)', 'var(--mat-teal-400)'],
    ['var(--mat-green-400)', 'var(--mat-green-400)'],
    ['var(--mat-light-green-400)', 'var(--mat-light-green-400)'],
    ['var(--mat-lime-400)', 'var(--mat-lime-400)'],

    ['var(--mat-yellow-400)', 'var(--mat-yellow-400)'],
    ['var(--mat-amber-400)', 'var(--mat-amber-400)'],
    ['var(--mat-orange-400)', 'var(--mat-orange-400)'],
    ['var(--mat-deep-orange-400)', 'var(--mat-deep-orange-400)']
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

  tabPrefsForm: FormGroup;

  /** ctor */
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

  /** Clear form contents */
  clear(nm: string): void {
    this.tabPrefsForm.patchValue({ [nm]: '' });
  }

  /** When we're ready */
  ngOnInit(): void {
    this.tabPrefsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(tabPrefsForm => {
        this.tabs.updateTab({ tab: { 
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
