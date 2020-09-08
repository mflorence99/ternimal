import { DestroyService } from '../services/destroy';
import { DraggableDirective } from './draggable';
import { Params } from '../services/params';

import 'jest-extended';

describe('DraggableDirective', () => {
  let destroy$: DestroyService;
  let mockElementRef: any;
  let params: Params;

  beforeEach(() => {
    destroy$ = new DestroyService();
    mockElementRef = {
      nativeElement: document.body
    };
    params = new Params();
  });

  test('draggable set after long click', (done) => {
    const draggable = new DraggableDirective(destroy$, mockElementRef, params);
    expect(draggable.draggable).toBe('false');
    draggable.ngOnInit();
    // dispatch mousedown
    const evt = document.createEvent('MouseEvents');
    evt.initEvent('mousedown', true, true);
    mockElementRef.nativeElement.dispatchEvent(evt);
    // still not draggable
    expect(draggable.draggable).toBe('false');
    // wait a while with mousedown then draggable should be set
    setTimeout(() => {
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('mouseup', true, true);
      mockElementRef.nativeElement.dispatchEvent(evt);
      expect(draggable.draggable).toBe('true');
      done();
    }, params.draggableAfter + 100);
  });
});
