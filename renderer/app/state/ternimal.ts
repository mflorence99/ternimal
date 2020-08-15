import { LongRunningOp } from '../common/long-running-op';
import { StorageService } from '../services/storage';

import { Computed } from '@ngxs-labs/data/decorators';
import { DataAction } from '@ngxs-labs/data/decorators';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Payload } from '@ngxs-labs/data/decorators';
import { Persistence } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

import { patch } from '@ngxs/store/operators';

interface DataActionParams {
  context?: any;
  enabled?: boolean;
  implementation?: string;
  op?: LongRunningOp;
}

export interface TernimalStateModel {
  enabled: boolean;
  op: LongRunningOp;
  showTabPrefs: boolean;
  showWidgetSidebar: boolean;
  unique: Record<string, number>;
  widgetSidebarCtx: any;
  widgetSidebarImpl: string;
}

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'ternimal', useClass: StorageService })
@StateRepository()
@State<TernimalStateModel>({
  name: 'ternimal',
  defaults: {
    enabled: true,
    op: {
      id: null,
      limit: 0,
      progress: 0,
      running: false
    },
    showTabPrefs: false,
    showWidgetSidebar: false,
    unique: {},
    widgetSidebarCtx: null,
    widgetSidebarImpl: null
  }
})
export class TernimalState extends NgxsDataRepository<TernimalStateModel> {
  // actions

  @DataAction({ insideZone: true })
  enable(@Payload('enable') { enabled }: DataActionParams): void {
    this.ctx.setState(patch({ enabled }));
  }

  @DataAction({ insideZone: true })
  hideTabPrefs(): void {
    this.ctx.setState(patch({ showTabPrefs: false }));
  }

  @DataAction({ insideZone: true })
  hideWidgetSidebar(): void {
    this.ctx.setState(patch({ showWidgetSidebar: false }));
  }

  @DataAction({ insideZone: true })
  longRunningOp(
    @Payload('Ternimal.longRunningOp')
    { op }: DataActionParams
  ): void {
    this.ctx.setState(patch({ op: op }));
  }

  @DataAction({ insideZone: true })
  showTabPrefs(): void {
    this.ctx.setState(patch({ showTabPrefs: true }));
  }

  @DataAction({ insideZone: true })
  showWidgetSidebar(
    @Payload('Ternimal.showWidgetSidebar')
    { implementation, context }: DataActionParams
  ): void {
    this.ctx.setState(
      patch({
        showWidgetSidebar: true,
        widgetSidebarCtx: context,
        widgetSidebarImpl: implementation
      })
    );
  }

  @DataAction({ insideZone: true })
  updateUnique(@Payload('updateUnique') { context }: DataActionParams): void {
    const unique = this.ctx.getState().unique[context] || 0;
    this.ctx.setState(patch({ unique: patch({ [context]: unique + 1 }) }));
  }

  // accessors

  @Computed() get isEnabled(): boolean {
    return this.snapshot.enabled;
  }

  @Computed() get op(): LongRunningOp {
    return this.snapshot.op;
  }

  @Computed() get tabPrefsShowing(): boolean {
    return this.snapshot.showTabPrefs;
  }

  @Computed() get widgetSidebarShowing(): boolean {
    return this.snapshot.showWidgetSidebar;
  }

  @Computed() get widgetSidebarCtx(): any {
    return this.snapshot.widgetSidebarCtx;
  }

  @Computed() get widgetSidebarImpl(): string {
    return this.snapshot.widgetSidebarImpl;
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  unique(context: string): number {
    this.updateUnique({ context });
    return this.snapshot.unique[context];
  }
}
