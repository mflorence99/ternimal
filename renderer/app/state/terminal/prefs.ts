import { PrefsState } from '../prefs';
import { PrefsStateModel } from '../prefs';
import { SelectionState } from '../../state/selection';
import { StorageService } from '../../services/storage';
import { Utils } from '../../services/utils';

import { Actions } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Persistence } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

export interface TerminalPrefs {
  fontFamily: string;
  fontSize: number;
}

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'terminalPrefs', useClass: StorageService })
@StateRepository()
@State<PrefsStateModel<TerminalPrefs>>({
  name: 'terminalPrefs',
  defaults: {
    byLayoutID: {},
    bySplitID: {},
    global: TerminalPrefsState.defaultPrefs(),
    scope: 'global'
  }
})
export class TerminalPrefsState extends PrefsState<TerminalPrefs> {
  //
  constructor(actions$: Actions, selection: SelectionState, utils: Utils) {
    super(actions$, selection, utils);
  }

  static defaultPrefs(): TerminalPrefs {
    return {
      fontFamily: 'monospace',
      fontSize: 12
    };
  }
}
