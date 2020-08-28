import { SelectionState } from '../state/selection';
import { Utils } from '../services/utils';

import { scratch } from './operators';

import { Actions } from '@ngxs/store';
import { Computed } from '@ngxs-labs/data/decorators';
import { DataAction } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { NgxsOnInit } from '@ngxs/store';
import { Payload } from '@ngxs-labs/data/decorators';

import { filter } from 'rxjs/operators';
import { patch } from '@ngxs/store/operators';

interface DataActionParams<T> {
  layoutID?: string;
  prefs?: Partial<T>;
  scope?: Scope;
  splitID?: string;
}

export interface Dictionary {
  isDate?: boolean;
  isNumber?: boolean;
  isSearchable?: boolean;
  name: string;
  tag: string;
}

export type Scope = 'global' | 'byLayoutID' | 'bySplitID';

export interface PrefsStateModel<T> {
  byLayoutID: Record<string, T>;
  bySplitID: Record<string, T>;
  global: T;
  scope: Scope;
}

export abstract class PrefsState<T>
  extends NgxsDataRepository<PrefsStateModel<T>>
  implements NgxsOnInit {
  //
  constructor(
    private actions$: Actions,
    private selection: SelectionState,
    private utils: Utils
  ) {
    super();
  }

  static defaultPrefs(): any {
    return {};
  }

  static emptyPrefs(): any {
    const nullify = (obj: any): any => {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key] = typeof obj[key] === 'object' ? nullify(obj[key]) : null;
        return acc;
      }, {});
    };
    return nullify(this.defaultPrefs());
  }

  // actions

  @DataAction({ insideZone: true })
  remove(
    @Payload('PrefsState.remove')
    { layoutID, splitID }: DataActionParams<T>
  ): void {
    if (layoutID && !splitID)
      this.ctx.setState(patch({ byLayoutID: scratch(layoutID) }));
    else if (!layoutID && splitID)
      this.ctx.setState(patch({ bySplitID: scratch(splitID) }));
  }

  @DataAction({ insideZone: true })
  rescope(@Payload('PrefsState.rescope') { scope }: DataActionParams<T>): void {
    this.ctx.setState(patch({ scope }));
  }

  @DataAction({ insideZone: true })
  update(
    @Payload('PrefsState.update')
    { layoutID, splitID, prefs }: DataActionParams<T>
  ): void {
    // NOTE: prefs may be Partial
    if (!layoutID && !splitID)
      this.ctx.setState(patch({ global: patch(prefs) }));
    else if (layoutID && !splitID) {
      if (!this.ctx.getState().byLayoutID[layoutID])
        this.ctx.setState(patch({ byLayoutID: patch({ [layoutID]: {} }) }));
      this.ctx.setState(
        patch({ byLayoutID: patch({ [layoutID]: patch(prefs) }) })
      );
    } else if (!layoutID && splitID) {
      if (!this.ctx.getState().bySplitID[splitID])
        this.ctx.setState(patch({ bySplitID: patch({ [splitID]: {} }) }));
      this.ctx.setState(
        patch({ bySplitID: patch({ [splitID]: patch(prefs) }) })
      );
    }
  }

  // accessors

  get dictionary(): Dictionary[] {
    return [];
  }

  @Computed() get byLayoutID(): T {
    return (
      this.snapshot.byLayoutID[this.selection.layoutID] ??
      PrefsState.emptyPrefs()
    );
  }

  @Computed() get bySplitID(): T {
    return (
      this.snapshot.bySplitID[this.selection.splitID] ?? PrefsState.emptyPrefs()
    );
  }

  @Computed() get global(): T {
    return this.snapshot.global;
  }

  @Computed() get scope(): Scope {
    return this.snapshot.scope;
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  effectivePrefs(layoutID: string, splitID: string): T {
    return this.utils.merge(
      this.snapshot.global,
      this.snapshot.byLayoutID[layoutID],
      this.snapshot.bySplitID[splitID]
    );
  }

  ngxsOnInit(): void {
    super.ngxsOnInit();
    this.handleActions$();
  }

  // private methods

  // NOTE: why do this here, rather than in the coordinated remove in
  // Tabs and PanesComponent? Because neither of those high-level components
  // "know" anything about the file-system widget
  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return (
            this.utils.hasProperty(action, /(Layout|Panes)State.remove/) &&
            status === 'SUCCESSFUL'
          );
        })
      )
      .subscribe(({ action }) => {
        const layoutID = action['LayoutState.remove']?.layoutID;
        const splitID = action['PanesState.remove']?.splitID;
        this.remove({ layoutID, splitID });
      });
  }
}
