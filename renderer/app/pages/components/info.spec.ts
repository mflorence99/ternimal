/* eslint-disable @typescript-eslint/unbound-method */
import { Channels } from '../../common/channels';
import { InfoComponent } from './info';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('InfoComponent', () => {

  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(InfoComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
    expect(component.electron.ipcRenderer.on).toHaveBeenCalled();
    const call = (component.electron.ipcRenderer.on as any).mock.calls[0];
    const channel = call[0];
    expect(channel).toEqual(Channels.systemInfo);
  });

});
