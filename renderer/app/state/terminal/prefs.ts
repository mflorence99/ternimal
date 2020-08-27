import { Params } from '../../services/params';
import { PrefsState } from '../prefs';
import { PrefsStateModel } from '../prefs';
import { SelectionState } from '../../state/selection';
import { StorageService } from '../../services/storage';
import { Utils } from '../../services/utils';

import { Actions } from '@ngxs/store';
import { FontWeight } from 'xterm';
import { Injectable } from '@angular/core';
import { Persistence } from '@ngxs-labs/data/decorators';
import { RendererType } from 'xterm';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

export interface TerminalPrefs {
  cursorBlink: boolean;
  cursorStyle: 'block' | 'underline' | 'bar';
  cursorWidth: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: FontWeight;
  fontWeightBold: FontWeight;
  letterSpacing: number;
  lineHeight: number;
  rendererType: RendererType;
  root: string;
  scrollSensitivity: number;
  scrollback: number;
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
      cursorBlink: false,
      cursorStyle: 'block',
      cursorWidth: 3,
      fontFamily: Params.xtermFontFamily,
      fontSize: 12,
      fontWeight: 'normal',
      fontWeightBold: 'bold',
      letterSpacing: 0,
      lineHeight: 1,
      rendererType: 'dom',
      root: Params.homeDir,
      scrollSensitivity: 1,
      scrollback: 2500
    };
  }
}
