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
  context?: string;
  enabled?: boolean;
}

export interface TernimalStateModel {
  enabled: boolean;
  showTabPrefs: boolean;
  unique: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'ternimal', useClass: StorageService })
@StateRepository()
@State<TernimalStateModel>({
  name: 'ternimal',
  defaults: {
    enabled: true,
    showTabPrefs: false,
    unique: { }
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
  showTabPrefs(): void {
    this.ctx.setState(patch({ showTabPrefs: true }));
  }

  @DataAction({ insideZone: true })
  toggleTabPrefs(): void {
    const showTabPrefs = this.ctx.getState().showTabPrefs;
    this.ctx.setState(patch({ showTabPrefs: !showTabPrefs }));
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

  @Computed() get tabPrefsShowing(): boolean {
    return this.snapshot.showTabPrefs;
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  unique(context: string): number {
    this.updateUnique({ context });
    return this.snapshot.unique[context];
  }

}
