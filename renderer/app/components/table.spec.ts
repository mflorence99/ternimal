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
          <th id="a">A</th>
          <th id="b">B</th>
          <th id="c">C</th>
        </tr>
      </thead>
      <tbody>
        <tr id="1">
          <td>A1</td>
          <td>B1</td>
          <td>C1</td>
        </tr>
        <tr id="2">
          <td>A2</td>
          <td>B2</td>
          <td>C2</td>
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
  });

  test('handleActions$', () => {
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
    expect(component.selectedRowIDs).toEqual([]);
  });

  test('snapshot', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
