import { TableComponent } from './table';

import { prepare } from './component.spec';

import 'jest-extended';

import { Component } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ViewChild } from '@angular/core';

// @see https://github.com/juristr/angular-testing-recipes/blob/master/src/app/components/content-projection.component.spec.ts

@Component({
  selector: 'table-spec',
  template: `
    <ternimal-table
      [hydrate]="true"
      [hydrateTrace]="false"
      splitID="s"
      tableID="t"
    >
      <thead>
        <tr>
          <th sortable id="a">A</th>
          <th sortable id="b">B</th>
          <th sortable id="c">C</th>
        </tr>
      </thead>
      <tbody>
        <tr class="hydrated" id="1">
          <td>A1</td>
          <td>B1</td>
          <td>C1</td>
        </tr>
        <tr id="2">
          <td>A2</td>
          <td>B2</td>
          <td>C2</td>
        </tr>
        <tr id="3">
          <td>A3</td>
          <td>B3</td>
          <td>C3</td>
        </tr>
      </tbody>
    </ternimal-table>
  `
})
class TableSpecComponent {
  @ViewChild(TableComponent, { static: true }) table;
}

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableSpecComponent>;
  let wrapper: TableSpecComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableSpecComponent, TableComponent]
    });
  });

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(TableSpecComponent);
    wrapper = fixture.componentInstance;
    component = wrapper.table;
    fixture.detectChanges();
  });

  test('cellElement', () => {
    expect(component.cellElement('1', 1)).toBeTruthy();
  });

  test('cleanup / columnUnhover', () => {
    component['hoverColumn'] = 2;
    const event = { relatedTarget: null } as MouseEvent;
    component.cleanup(event);
    // NOTE: prvate member
    expect(component['hoverColumn']).toBe(-1);
  });

  test('columnHover', () => {
    const event = {
      target: component.header.nativeElement.querySelector(
        'th:nth-child(2) div.column'
      ),
      stopPropagation: () => {}
    } as MouseEvent;
    // fake hovering over column B when C was previously hovered
    component['hoverColumn'] = 2;
    component.columnHover(event);
    expect(component['hoverColumn']).toBe(1);
  });

  test('columnSort - new column', () => {
    const event = {
      buttons: 1,
      target: component.header.nativeElement.querySelector(
        'th:nth-child(2) div.column'
      ),
      stopPropagation: () => {}
    } as MouseEvent;
    // fake sorting column B when C was previously sorted
    component.sortDir = -1;
    component.sortedColumn = 2;
    component.columnSort(event);
    expect(component.sortedColumn).toBe(1);
  });

  test('columnSort - change direction', () => {
    const event = {
      buttons: 1,
      target: component.header.nativeElement.querySelector(
        'th:nth-child(2) div.column'
      ),
      stopPropagation: () => {}
    } as MouseEvent;
    // fake sorting column B when C was previously sorted
    component.sortDir = -1;
    component.sortedColumn = 1;
    component.columnSort(event);
    expect(component.sortDir).toBe(1);
  });

  test('handleActions$', (done) => {
    // select some rows
    component.rowSelectByIDs(['1', '2']);
    expect(component.selectedRowIDs).toEqual(['1', '2']);
    component.ngOnInit();
    // NOTE: we cheated and made Actions a Subject rather than an Observable
    component.actions$['next']({
      action: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'SelectionState.selectSplit': {
          splitID: 'x'
        }
      },
      status: 'SUCCESSFUL'
    });
    // expect rows to be deselected if we flip to another split
    // NOTE: this sucks but we have a debounce in the observe pipe
    setTimeout(() => {
      expect(component.selectedRowIDs).toEqual([]);
      done();
    }, 100);
  });

  test('isHydrated', () => {
    component['hydratedRowIDs'].add('1');
    expect(component.isHydrated('1')).toBeTrue();
  });

  test('observeIntersectionImpl', (done) => {
    const entries: any = [
      {
        target: component.body.nativeElement.querySelector('tr[id="1"]'),
        isIntersecting: false
      },
      {
        target: component.body.nativeElement.querySelector('tr[id="2"]'),
        isIntersecting: true
      }
    ];
    // NOTE: we force tracing to get the coverage, but we don't want
    // to see the trace on the test report
    component.hydrateTrace = true;
    const fn = console.log;
    console.log = jest.fn();
    component.rehydrated.subscribe(() => {
      console.log = fn;
      done();
    });
    component['observeIntersectionImpl'](entries);
  });

  test('resize / observeRows', () => {
    component.resize();
    expect(Array.from(component['observedRowIDs'])).toEqual(['1', '2', '3']);
  });

  test('rowDeselect / rowUnselect', () => {
    component.selectedRowIDs = ['1', '2'];
    const event = {
      stopPropagation: () => {}
    } as MouseEvent;
    component.rowDeselect(event);
    expect(component.selectedRowIDs).toEqual([]);
  });

  test('rowSelect', () => {
    // pretend that row 3 was already selected
    component.selectedRowIDs = ['3'];
    // click row 2
    let event = {
      buttons: 1,
      target: component.body.nativeElement.querySelector('tr[id="2"] td'),
      stopPropagation: () => {}
    } as MouseEvent;
    component.rowSelect(event);
    expect(component.selectedRowIDs).toEqual(['2']);
    // now CTRL+click row 1
    event = {
      buttons: 1,
      ctrlKey: true,
      target: component.body.nativeElement.querySelector('tr[id="1"] td'),
      stopPropagation: () => {}
    } as MouseEvent;
    component.rowSelect(event);
    expect(component.selectedRowIDs).toEqual(['2', '1']);
  });

  test('rowSelect / rowSelectXtnd', () => {
    let event = {
      buttons: 1,
      target: component.body.nativeElement.querySelector('tr[id="1"] td'),
      stopPropagation: () => {}
    } as MouseEvent;
    component.rowSelect(event);
    expect(component.selectedRowIDs).toEqual(['1']);
    // now SHIFT+click row 2
    event = {
      buttons: 1,
      shiftKey: true,
      target: component.body.nativeElement.querySelector('tr[id="2"] td'),
      stopPropagation: () => {}
    } as MouseEvent;
    component.rowSelectXtnd(event);
    expect(component.selectedRowIDs).toEqual(['1', '2']);
  });

  test('rowSelectCancel', () => {
    component['selecting'] = true;
    const event = {
      stopPropagation: () => {}
    } as MouseEvent;
    component.rowSelectCancel(event);
    expect(component['selecting']).toBeFalse();
  });

  test('snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });
});
