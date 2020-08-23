import { Dictionary } from '../prefs';
import { PrefsState } from '../prefs';
import { PrefsStateModel } from '../prefs';
import { SelectionState } from '../../state/selection';
import { StorageService } from '../../services/storage';
import { Utils } from '../../services/utils';

import { Actions } from '@ngxs/store';
import { Computed } from '@ngxs-labs/data/decorators';
import { Injectable } from '@angular/core';
import { Persistence } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

export type TimeFmt = 'duration' | 'hhmmss';

export interface ProcessListPrefs {
  showSparkline: boolean;
  timeFormat: TimeFmt;
  visibility: Record<string, boolean>;
}

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'processListPrefs', useClass: StorageService })
@StateRepository()
@State<PrefsStateModel<ProcessListPrefs>>({
  name: 'processListPrefs',
  defaults: {
    byLayoutID: {},
    bySplitID: {},
    global: ProcessListPrefsState.defaultPrefs(),
    scope: 'global'
  }
})
export class ProcessListPrefsState extends PrefsState<ProcessListPrefs> {
  //
  constructor(actions$: Actions, selection: SelectionState, utils: Utils) {
    super(actions$, selection, utils);
  }

  static defaultPrefs(): ProcessListPrefs {
    return {
      showSparkline: true,
      timeFormat: 'hhmmss',
      visibility: {
        cmd: true,
        cpu: true,
        ctime: true,
        memory: true,
        name: true,
        pid: true,
        ppid: true,
        uid: true
      }
    };
  }

  @Computed() get dictionary(): Dictionary[] {
    return [
      { name: 'pid', tag: 'PID', isNumber: true },
      { name: 'ppid', tag: 'PPID', isNumber: true },
      { name: 'uid', tag: 'UID' },
      { name: 'name', tag: 'Name' },
      { name: 'cpu', tag: 'CPU', isNumber: true },
      { name: 'memory', tag: 'Mem', isNumber: true },
      { name: 'ctime', tag: 'Time', isNumber: true },
      { name: 'cmd', tag: 'Command' }
    ];
  }
}
