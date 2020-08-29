import { Params } from '../services/params';
import { StorageService } from '../services/storage';

import { scratch } from './operators';

import { DataAction } from '@ngxs-labs/data/decorators';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Payload } from '@ngxs-labs/data/decorators';
import { Persistence } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

import { patch } from '@ngxs/store/operators';

interface DataActionParams {
  splitID?: string;
  status?: Partial<Status>;
  widgetID?: string;
}

export interface Status {
  cwd?: string;
  search?: string;
  searchCaseSensitive?: boolean;
  searchRegex?: boolean;
  searchWholeWord?: boolean;
}

export type StatusStateModel = Record<string, Record<string, Status>>;

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'status', useClass: StorageService })
@StateRepository()
@State<StatusStateModel>({
  name: 'status',
  defaults: {}
})
export class StatusState extends NgxsDataRepository<StatusStateModel> {
  static defaultStatus(): Status {
    return {
      cwd: Params.homeDir
    };
  }

  // actions

  @DataAction({ insideZone: true })
  remove(@Payload('StatusState.remove') { splitID }: DataActionParams): void {
    this.ctx.setState(scratch(splitID));
  }

  @DataAction({ insideZone: true })
  update(
    @Payload('StatusState.update')
    { splitID, widgetID, status }: DataActionParams
  ): void {
    if (!this.ctx.getState()[splitID])
      this.ctx.setState(patch({ [splitID]: {} }));
    if (!this.ctx.getState()[splitID][widgetID])
      this.ctx.setState(patch({ [splitID]: patch({ [widgetID]: {} }) }));
    this.ctx.setState(
      patch({ [splitID]: patch({ [widgetID]: patch(status) }) })
    );
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  match(splitID: string, widgetID: string, matchees: string[]): boolean {
    const status = this.status(splitID, widgetID);
    if (!status.search || matchees.length === 0) return true;
    const regex = this.regex(splitID, widgetID);
    return matchees.some((matchee) => {
      return regex.exec(matchee);
    });
  }

  regex(splitID: string, widgetID: string): RegExp {
    const status = this.status(splitID, widgetID);
    if (!status.search) return null;
    let matcher = status.search;
    // @see https://stackoverflow.com/questions/3115150
    if (!status.searchRegex)
      matcher = matcher.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    if (status.searchWholeWord) matcher = '\\b' + matcher + '\\b';
    const flags = status.searchCaseSensitive ? 'g' : 'gi';
    return new RegExp(`(${matcher})`, flags);
  }

  status(splitID: string, widgetID: string): Status {
    return this.snapshot[splitID]?.[widgetID] ?? StatusState.defaultStatus();
  }
}
