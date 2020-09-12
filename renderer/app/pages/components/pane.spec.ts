import { Channels } from '../../common';
import { PaneComponent } from './pane';

import { prepare } from '../page.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('PaneComponent', () => {
  let component: PaneComponent;
  let fixture: ComponentFixture<PaneComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(PaneComponent);
    component = fixture.componentInstance;
  });

  test('allWidgets', () => {
    const implementations = PaneComponent.allWidgets.map(
      (widget) => widget.widgetLaunch.implementation
    );
    expect(implementations).toEqual([
      'TerminalComponent',
      'FileSystemComponent',
      'ProcessListComponent'
    ]);
  });

  test('cancelLongRunningOp', () => {
    component.cancelLongRunningOp();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(component.electron.ipcRenderer.send).toHaveBeenCalledWith(
      Channels.longRunningOpCancel,
      component.ternimal.longRunningOp.id
    );
  });
});
