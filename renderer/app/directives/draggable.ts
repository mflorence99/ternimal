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
    fromEvent(this.host.nativeElement, 'mousedown')
      .pipe(
        mergeMap((down) => {
          // turn off any residual draggable
          this.draggable = 'false';
          return of(down).pipe(
            delay(this.params.draggableAfter),
            takeUntil(
              merge(
                fromEvent(this.host.nativeElement, 'mouseout'),
                fromEvent(this.host.nativeElement, 'mouseup')
              )
            )
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // now we have a "long press" to trigger the drag
        // but we ate the mousedown to get here, so we have to re-send it
        // @see https://stackoverflow.com/questions/24025165/
        const evt = document.createEvent('MouseEvents');
        evt.initEvent('mousedown', true, true);
        this.host.nativeElement.dispatchEvent(evt);
        // now the host is draggable
        this.draggable = 'true';
      });
  }
}
