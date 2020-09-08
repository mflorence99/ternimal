import './paths';

import { Channels } from '../common';

import { on } from '../common';

import 'jest-extended';

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
    on(Channels.fsHomeDir)(event);
    expect(event.returnValue).toEqual(app.getPath('home'));
  });

  test('fsParentDir', () => {
    on(Channels.fsParentDir)(event, __filename);
    expect(event.returnValue).toEqual(__dirname);
  });

  test('fsParsePath', () => {
    on(Channels.fsParsePath)(event, __filename);
    expect(event.returnValue).toEqual(
      expect.objectContaining({
        base: 'paths.spec.ts',
        dir: __dirname,
        ext: '.ts',
        name: 'paths.spec'
      })
    );
  });

  test('fsPathSeparator', () => {
    on(Channels.fsPathSeparator)(event);
    expect(event.returnValue).toEqual(path.sep);
  });

  test('fsRootDir', () => {
    on(Channels.fsRootDir)(event);
    // TODO: cheating
    expect(event.returnValue).toBe('/');
  });
});
