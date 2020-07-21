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

export interface TernimalStateModel {
  enabled: boolean;
  unique: number;
}

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'ternimal', useClass: StorageService })
@StateRepository()
@State<TernimalStateModel>({
  name: 'ternimal',
  defaults: {
    enabled: true,
    unique: 1
  }
})

export class TernimalState extends NgxsDataRepository<TernimalStateModel> {

  // actions

  @DataAction({ insideZone: true })
  enable(@Payload('enable') { enabled }): void {
    this.ctx.setState(patch({ enabled }));
  }

  // accessors

  @Computed() get isEnabled(): boolean {
    return this.snapshot.enabled;
  }

  get unique(): number {
    const unique = this.ctx.getState().unique;
    this.ctx.setState(patch({ unique: unique + 1 }));
    return unique;
  }

}
