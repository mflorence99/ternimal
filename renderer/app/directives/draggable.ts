import { DestroyService } from '../services/destroy';
import { Params } from '../services/params';

import { Directive } from '@angular/core';
import { ElementRef } from '@angular/core';
import { HostBinding } from '@angular/core';
import { OnInit } from '@angular/core';

import { delay } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { merge } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  providers: [DestroyService],
  selector: '[ternimalDraggable]'
})
export class DraggableDirective implements OnInit {
  @HostBinding('attr.draggable') draggable = 'false';

  constructor(
    private destroy$: DestroyService,
    private host: ElementRef,
    private params: Params
  ) {}

  ngOnInit(): void {
    const host = this.host.nativeElement;
    const down$ = fromEvent(host, 'mousedown');
    const out$ = fromEvent(host, 'mouseout');
    const up$ = fromEvent(host, 'mouseup');
    const drag$ = down$.pipe(
      mergeMap((down) => {
        this.draggable = 'false';
        return of(down).pipe(
          delay(this.params.draggableAfter),
          takeUntil(merge(out$, up$))
        );
      }),
      takeUntil(this.destroy$)
    );
    drag$.subscribe(() => {
      // https://stackoverflow.com/questions/24025165/
      const evt = document.createEvent('MouseEvents');
      evt.initEvent('mousedown', true, true);
      host.dispatchEvent(evt);
      this.draggable = 'true';
    });
  }
}
