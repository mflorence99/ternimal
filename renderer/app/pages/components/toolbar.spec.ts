/* eslint-disable @typescript-eslint/unbound-method */
import { Channels } from '../../common/channels';
import { ToolbarComponent } from './toolbar';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('ToolbarComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(ToolbarComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  test('devtools', () => {
    const fixture = TestBed.createComponent(ToolbarComponent);
    const component = fixture.componentInstance;
    component.devTools();
    expect(component.electron.ipcRenderer.send).toHaveBeenCalled();
    const call = (component.electron.ipcRenderer.send as any).mock.calls[0];
    const channel = call[0];
    expect(channel).toEqual(Channels.openDevTools);
  });

  test('newLayout', () => {
    const fixture = TestBed.createComponent(ToolbarComponent);
    const component = fixture.componentInstance;
    expect(component.tabs.snapshot.length).toBe(1);
    component.newLayout();
    expect(component.tabs.snapshot.length).toBe(2);
  });

  test('reload', () => {
    const fixture = TestBed.createComponent(ToolbarComponent);
    const component = fixture.componentInstance;
    component.reload();
    expect(component.electron.ipcRenderer.send).toHaveBeenCalled();
    const call = (component.electron.ipcRenderer.send as any).mock.calls[0];
    const channel = call[0];
    expect(channel).toEqual(Channels.reload);
  });
});
