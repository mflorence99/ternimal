import { ColumnSort } from '../state/sort';
import { DestroyService } from '../services/destroy';
import { Params } from '../services/params';

import { Actions } from '@ngxs/store';
import { AfterContentInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ViewChild } from '@angular/core';

import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DestroyService],
  selector: 'ternimal-table',
  templateUrl: 'table.html',
  styleUrls: ['table.scss']
})

export class TableComponent implements AfterContentInit {

  @ViewChild('body', { static: true }) body: ElementRef;
  @ViewChild('header', { static: true }) header: ElementRef;

  scrollLeft: 0;

  selectedRows$ = new Subject<string[]>();
  sortedColumn$ = new Subject<ColumnSort>();

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input() sortDir: number;
  @Input() sortedColumn: number;

  // NOTE: hidden until view rendered
  visibility = 'hidden';

  private hoverColumn = -1;
  private rowIDs: string[] = null;
  private rowIndexByID: Record<string, number> = null;
  private selectedRows: string[] = [];
  private ths: HTMLElement[];

  constructor(private actions$: Actions,
              private destroy$: DestroyService,
              private params: Params) { 
    this.handleActions$();            
  }

  @HostListener('mouseout', ['$event']) cleanup(event: MouseEvent): void {
    this.columnUnhover(event);
  }

  columnHover(event: MouseEvent): void {
    const column = event.target as HTMLElement;
    if (column.getAttribute('_ix') != null) {
      const hoverColumn = Number(column.getAttribute('_ix'));
      if (hoverColumn !== this.hoverColumn) {
        // hover the new column
        this.addClass(this.ths[hoverColumn], 'hover');
        this.applyClass(this.body.nativeElement, `tr td:nth-child(${hoverColumn + 1})`, 'hover');
        // unhover the old
        if (this.hoverColumn !== -1) {
          this.removeClass(this.ths[this.hoverColumn], 'hover');
          this.unapplyClass(this.body.nativeElement, `tr td:nth-child(${this.hoverColumn + 1})`, 'hover');
        }
        this.hoverColumn = hoverColumn;
      }
    }
  }

  columnSort(event: MouseEvent): void {
    const column = event.target as HTMLElement;
    if ((column.getAttribute('_ix') != null) && (event.buttons === 1)) {
      const sortedColumn = Number(column.getAttribute('_ix'));
      if (this.ths[sortedColumn].getAttribute('sortable') != null) {
        if (sortedColumn !== this.sortedColumn) {
          // mark the new column as sorted
          this.addClass(this.ths[sortedColumn], 'sorted');
          this.applyClass(this.body.nativeElement, `tr td:nth-child(${sortedColumn + 1})`, 'sorted');
          // unmark the old
          if (this.sortedColumn !== -1) {
            const oldColumn = this.ths[this.sortedColumn];
            this.removeClass(oldColumn, 'sorted');
            this.setHeaderText(oldColumn, oldColumn.getAttribute('_text'));
            this.unapplyClass(this.body.nativeElement, `tr td:nth-child(${this.sortedColumn + 1})`, 'sorted');
          }
          this.sortDir = 1;
          this.sortedColumn = sortedColumn;
        } else this.sortDir *= -1;
        // set the column text to indicate the sort direction
        const newColumn = this.ths[this.sortedColumn];
        this.setHeaderText(newColumn, newColumn.getAttribute('_text') + '\u00a0' + ((this.sortDir === 1) ? this.params.table.sortUpArrow : this.params.table.sortDownArrow));
        // clear the selection
        this.rowUnselect();
        // publish the sort
        const columnSort: ColumnSort = {
          sortDir: this.sortDir,
          sortedColumn: this.sortedColumn,
          sortedID: newColumn.getAttribute('id')
        };
        this.sortedColumn$.next(columnSort);
      }
    }
  }

  columnUnhover(event: MouseEvent): void {
    const outside = (event.relatedTarget == null)
      || (!this.body.nativeElement.contains(event.relatedTarget)
        && !this.header.nativeElement.contains(event.relatedTarget));
    if (outside && (this.hoverColumn !== -1)) {
      this.removeClass(this.ths[this.hoverColumn], 'hover');
      this.unapplyClass(this.body.nativeElement, `tr td:nth-child(${this.hoverColumn + 1})`, 'hover');
      this.hoverColumn = -1;
    }
  }

  ngAfterContentInit(): void {
    this.mungeHeaders();
    this.syncCells();
  }

  resize(): void {
    this.syncCells();
  }

  rowSelect(event: MouseEvent, forceShift = false): void {
    const tr = this.findRow(event);
    if (tr) {
      const oldSelected = new Set<string>(this.selectedRows);
      let newSelected = new Set<string>();
      // NOTE: right-click does not affect selection if row already selected
      if ((event.buttons === 1) || ((event.buttons === 2) && !oldSelected.has(tr.id))) {
        // SHIFT KEY DOWN
        if (event.shiftKey || forceShift) {
          oldSelected.forEach(id => newSelected.add(id));
          if (newSelected.size === 0)
            newSelected.add(tr.id);
          else newSelected = new Set<string>(this.rowSelectXtndImpl(tr.id, [...newSelected]));
        // CTRL KEY DOWN
        } else if (event.ctrlKey || event.metaKey) {
          oldSelected.forEach(id => newSelected.add(id));
          newSelected.has(tr.id) ? newSelected.delete(tr.id) : newSelected.add(tr.id);
        // CLEAN SELECT
        } else newSelected.add(tr.id);
        // unselect those in the old not also in the new
        let diff = new Set<string>([...oldSelected].filter(id => !newSelected.has(id)));
        diff.forEach(id => this.unapplyClass(this.body.nativeElement, `tr[id="${id}"] td`, 'selected'));
        // select all those in the new not also in the old
        diff = new Set<string>([...newSelected].filter(id => !oldSelected.has(id)));
        diff.forEach(id => this.applyClass(this.body.nativeElement, `tr[id="${id}"] td`, 'selected'));
        // publish the selection
        this.selectedRows = [...newSelected];
        this.selectedRows$.next(this.selectedRows);
      }
    }
  }

  rowSelectCancel(): void {
    this.rowIDs = null;
    this.rowIndexByID = null;
  }

  rowSelectXtnd(event: MouseEvent): void {
    if (event.buttons === 1)
      this.rowSelect(event, /* forceShift= */ true);
  }

  rowUnselect(): void {
    this.selectedRows.forEach(id => this.unapplyClass(this.body.nativeElement, `tr[id="${id}"] td`, 'selected'));
    this.selectedRows = [];
    this.selectedRows$.next(this.selectedRows);
  }

  // private methods

  private addClass(element: HTMLElement, clazz: string): void {
    element.classList.add(clazz);
  }

  private apply(root: HTMLElement, selector: string, cb: (element: HTMLElement, ix?: number) => void): HTMLElement[] {
    const elements = this.findElements(root, selector);
    elements.forEach(cb);
    return elements;
  }

  private applyClass(root: HTMLElement, selector: string, clazz: string):void {
    this.apply(root, selector, element => this.addClass(element, clazz));
  }

  private findElement(root: HTMLElement, selector: string): HTMLElement {
    return root.querySelector(selector);
  }

  private findElements(root: HTMLElement, selector: string): HTMLElement[] {
    return Array.from(root.querySelectorAll(selector));
  }

  private findRow(event: MouseEvent): HTMLElement {
    const cell = event.target as HTMLElement;
    // NOTE: row must have ID
    return cell.closest('tr[id]');
  }

  private handleActions$(): void {
    this.actions$
      .pipe(takeUntil(this.destroy$))
      // NOTE: update column heads after ANY potential state change
      .subscribe(() => this.syncCells());
  }

  private mungeHeaders(): void {
    this.ths = this.apply(this.header.nativeElement, 'tr:first-child th', (th, ix) => {
      this.addClass(th, 'horizontal');
      th.setAttribute('_dir', 'horizontal');
      th.setAttribute('_text', th.innerText);
      let text = th.innerText;
      if (ix === this.sortedColumn)
        text += (this.sortDir === 1) ? `\u00a0${this.params.table.sortUpArrow}` : `\u00a0${this.params.table.sortDownArrow}`;
      th.innerHTML = `
        <div class="column" _ix="${ix}">
          <div class="text" _ix="${ix}">
            ${text}
          </div
        </div>`;
    });
  }

  private removeClass(element: HTMLElement, clazz: string): void {
    element.classList.remove(clazz);
  }

  private replaceClass(element: HTMLElement, oldClass: string, newClass: string): void {
    element.classList.replace(oldClass, newClass);
  }

  private rowSelectXtndImpl(id: string, selectedIDs: string[]): string[] {
    // cache the translation of ids to rows until mouseup
    if (this.rowIDs == null) {
      this.rowIDs = this.findElements(this.body.nativeElement, 'tr').map(tr => tr.id);
      this.rowIndexByID = this.rowIDs.reduce((acc, id, ix) => {
        acc[id] = ix;
        return acc;
      }, { });
    }
    // now extend the selection by row index
    let row = this.rowIndexByID[id];
    const alreadySelected = selectedIDs
      .map(id => this.rowIndexByID[id])
      .sort((p, q) => p - q);
    const newlySelected = [];
    while (row < alreadySelected[0])
      newlySelected.push(row++);
    while (row > alreadySelected[alreadySelected.length - 1])
      newlySelected.push(row--);
    // ... and return it as IDs
    return alreadySelected
      .concat(newlySelected)
      .map(row => this.rowIDs[row]);
  }

  private setHeaderText(column: HTMLElement, text: string): void {
    const element = this.findElement(column, '.column div.text');
    element.innerText = text;
  }

  private syncCells(): void {
    const tds = this.apply(this.body.nativeElement, 'tr:first-child td', (td, ix) => {
      const th = this.ths[ix];
      const rect = td.getBoundingClientRect();
      th.style.minWidth = `${rect.width}px`;
      th.style.width = `${rect.width}px`;
      // NOTE: only replace the direction class if necessary
      const oldDir = th.getAttribute('_dir');
      const newDir = rect.width > this.params.table.verticalThreshold ? 'horizontal' : 'vertical';
      if (oldDir !== newDir) {
        this.replaceClass(th, oldDir, newDir);
        th.setAttribute('_dir', newDir);
      }
    });
    // NOTE: visible now that content has been rendered
    if (tds.length > 0)
      this.visibility = 'visible';
  }

  private unapplyClass(root: HTMLElement, selector: string, clazz: string): void {
    this.apply(root, selector, element => this.removeClass(element, clazz));
  }

}
