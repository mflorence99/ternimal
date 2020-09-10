import { Bundle } from '../state.spec';
import { Channels } from '../../common';

import { on } from '../../common';
import { prepare } from '../state.spec';

import 'jest-extended';

// @see __mocks__/ngx-electron

const state: Record<string, string> = {
  s: 'sss',
  t: 'ttt'
};

describe('TerminalXtermDataState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.terminalXtermData.setState(state);
    bundle.selection.selectSplit({ splitID: 's' });
  });

  test('consume', () => {
    bundle.terminalXtermData.consume({ splitID: 's' });
    expect(bundle.terminalXtermData.snapshot).toEqual({
      s: null,
      t: 'ttt'
    });
  });

  test('produce', () => {
    bundle.terminalXtermData.produce({ splitID: 's', data: 'ttt' });
    expect(bundle.terminalXtermData.snapshot).toEqual({
      s: 'sssttt',
      t: 'ttt'
    });
  });

  test('remove', () => {
    bundle.terminalXtermData.remove({ splitID: 's' });
    expect(bundle.terminalXtermData.snapshot).toEqual({
      t: 'ttt'
    });
  });

  test('xtermData', () => {
    expect(bundle.terminalXtermData.xtermData('s')).toBe('sss');
    expect(bundle.terminalXtermData.snapshot).toEqual({
      s: null,
      t: 'ttt'
    });
  });

  test('handleActions$/remove', () => {
    bundle.terminalXtermData.ngxsOnInit();
    // pretend that some action has deleted a split
    // NOTE: we cheated and made Actions a Subject rather than an Observable
    bundle.terminalXtermData.actions$['next']({
      action: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'PanesState.remove': {
          splitID: 's'
        }
      },
      status: 'SUCCESSFUL'
    });
    expect(bundle.terminalXtermData.snapshot).toEqual({
      t: 'ttt'
    });
    expect(
      // eslint-disable-next-line @typescript-eslint/unbound-method
      bundle.terminalXtermData.electron.ipcRenderer.send
    ).toHaveBeenCalledWith(Channels.xtermKill, 's');
  });

  test('rcvXtermCWD$', () => {
    bundle.terminalXtermData.ngxsOnInit();
    on(Channels.xtermCWD)(undefined, 's', '/home');
    expect(bundle.terminalXtermData.prefs.bySplitID).toEqual({
      root: '/home'
    });
    expect(bundle.terminalXtermData.status.snapshot).toEqual(
      expect.objectContaining({
        s: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          TerminalComponent: {
            cwd: '/home'
          }
        }
      })
    );
  });

  test('rcvXtermData$', () => {
    bundle.terminalXtermData.ngxsOnInit();
    on(Channels.xtermFromPty)(undefined, 's', 'ttt');
    expect(bundle.terminalXtermData.snapshot).toEqual({
      s: 'sssttt',
      t: 'ttt'
    });
  });
});
