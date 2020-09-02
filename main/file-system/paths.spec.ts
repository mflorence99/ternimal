import './paths';

import { Channels } from '../common';

import * as electron from 'electron';
import * as path from 'path';

// @see __mocks__/electron.ts

const { app } = electron;

describe('paths', () => {
  const event = {
    returnValue: null
  };

  beforeEach(() => {
    event.returnValue = null;
  });

  test('fsHomeDir', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.fsHomeDir](event);
    expect(event.returnValue).toEqual(app.getPath('home'));
  });

  test('fsParentDir', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.fsParentDir](event, __filename);
    expect(event.returnValue).toEqual(__dirname);
  });

  test('fsParsePath', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.fsParsePath](event, __filename);
    expect(event.returnValue.base).toEqual('paths.spec.ts');
    expect(event.returnValue.dir).toEqual(__dirname);
    expect(event.returnValue.ext).toEqual('.ts');
    expect(event.returnValue.name).toEqual('paths.spec');
  });

  test('fsPathSeparator', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.fsPathSeparator](event);
    expect(event.returnValue).toEqual(path.sep);
  });

  test('fsRootDir', () => {
    const callbacks = electron['callbacks'];
    callbacks[Channels.fsRootDir](event);
    // TODO: cheating
    expect(event.returnValue).toEqual('/');
  });
});
