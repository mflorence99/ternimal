import { Bundle } from '../state.spec';
import { Channels } from '../../common';
import { Params } from '../../services/params';
import { ProcessDescriptor } from '../../common';

import { on } from '../../common';
import { prepare } from '../state.spec';

import 'jest-extended';

// @see __mocks__/ngx-electron

describe('ProcessListState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.processList.setState([]);
  });

  test('update', () => {
    // force the number of points to be 2
    bundle.processList.params.processList.maxTimeline = 2;
    bundle.processList.params.processList.pollInterval = 1;
    // fire off one sample
    bundle.processList.update({
      processList: [
        { cpu: 1, memory: 10, pid: 1, timestamp: 1 } as ProcessDescriptor
      ]
    });
    expect(bundle.processList.snapshot).toEqual([
      expect.objectContaining({
        cpu: 1,
        cpuTimeline: {
          data: [1, NaN],
          labels: ['1', null]
        },
        memory: 10,
        memoryTimeline: {
          data: [10, NaN],
          labels: ['1', null]
        },
        pid: 1
      })
    ]);
    // now add another sample to see the timeline grow
    bundle.processList.update({
      processList: [
        { cpu: 2, memory: 20, pid: 1, timestamp: 2 } as ProcessDescriptor
      ]
    });
    expect(bundle.processList.snapshot).toEqual([
      expect.objectContaining({
        cpu: 2,
        cpuTimeline: {
          data: [1, 2],
          labels: ['1', '2']
        },
        memory: 20,
        memoryTimeline: {
          data: [10, 20],
          labels: ['1', '2']
        },
        pid: 1
      })
    ]);
    // fire off a third and the timeline should rotate
    bundle.processList.update({
      processList: [
        { cpu: 3, memory: 30, pid: 1, timestamp: 3 } as ProcessDescriptor
      ]
    });
    expect(bundle.processList.snapshot).toEqual([
      expect.objectContaining({
        cpu: 3,
        cpuTimeline: {
          data: [2, 3],
          labels: ['2', '3']
        },
        memory: 30,
        memoryTimeline: {
          data: [20, 30],
          labels: ['2', '3']
        },
        pid: 1
      })
    ]);
  });

  test('pollProcessList$', (done) => {
    // make the one and only default split a process list
    bundle.selection.selectLayout({ layoutID: Params.initialLayoutID });
    bundle.selection.selectSplit({ splitID: Params.initialSplitID });
    bundle.processList.panes.update({
      splitID: Params.initialSplitID,
      prefs: {
        widget: 'ProcessListComponent'
      }
    });
    bundle.processList.ngxsOnInit();
    // TODO: kind of sucks but much else is overkill
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(bundle.processList.electron.ipcRenderer.send).toHaveBeenCalledWith(
        Channels.processListRequest
      );
      done();
    }, 100);
  });

  test('rcvProcessList$', () => {
    bundle.processList.ngxsOnInit();
    on(Channels.processListResponse)(undefined, [
      {
        processList: [
          { cpu: 1, memory: 10, pid: 1, timestamp: 1 } as ProcessDescriptor
        ]
      }
    ]);
    expect(bundle.processList.snapshot).toEqual(expect.any(Array));
  });
});
