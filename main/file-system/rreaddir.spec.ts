import { rreaddir } from './rreaddir';

import * as fs from 'fs-extra';
import * as path from 'path';

describe('rreaddir', () => {
  test('smoke test', async () => {
    const hash: Record<string, fs.Stats> = {};
    await rreaddir(path.join(__dirname, '..'), hash);
    expect(Object.keys(hash).length).toBeGreaterThan(1);
    expect(hash[__filename]).toBeTruthy();
  });

  test('budgeted count can be exceeded', async () => {
    const hash: Record<string, fs.Stats> = {};
    expect.assertions(2);
    try {
      await rreaddir(path.join(__dirname, '..'), hash, 5);
    } catch (error) {
      expect(error.message).toContain(' 5 ');
      expect(hash).toEqual({});
    }
  });

  test('budgeted time can be exceeded', async () => {
    const hash: Record<string, fs.Stats> = {};
    expect.assertions(2);
    try {
      await rreaddir(path.join(__dirname, '..', '..'), hash, 0, 1);
    } catch (error) {
      expect(error.message).toContain(' 1ms ');
      expect(hash).toEqual({});
    }
  });

  test('quick exit on unreadable directory', async () => {
    const hash: Record<string, fs.Stats> = {};
    expect.assertions(2);
    try {
      await rreaddir('/root', hash);
    } catch (error) {
      expect(error.message).toBeTruthy();
      expect(hash).toEqual({});
    }
  });

  test('real-life test on home directory', async () => {
    const hash: Record<string, fs.Stats> = {};
    expect.assertions(2);
    try {
      await rreaddir('/home', hash, 0, 500);
    } catch (error) {
      expect(error.message).toBeTruthy();
      expect(hash).toEqual({});
    }
  });
});
