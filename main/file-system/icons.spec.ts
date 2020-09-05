import './icons';

import { makeColor } from './icons';
import { makeIcon } from './icons';

import * as fs from 'fs-extra';
import * as path from 'path';

describe('icons', () => {
  test('makeColor', () => {
    // color of directory
    let color = makeColor(__dirname, fs.lstatSync(__dirname));
    expect(color).toEqual('var(--mat-deep-orange-a100)');
    // color of file
    color = makeColor(__filename, fs.lstatSync(__filename));
    expect(color).toBeTruthy();
    // color of symlink
    const symlink = path.join(__dirname, '..', 'common', 'index.ts');
    color = makeColor(symlink, fs.lstatSync(symlink));
    expect(color).toEqual('var(--mat-brown-400)');
    // fake color of file with no ext
    color = makeColor('/this/that', fs.lstatSync(__filename));
    expect(color).toEqual('var(--mat-blue-grey-400)');
  });

  test('makeIcon', () => {
    // icon of directory
    let icon = makeIcon(__dirname, fs.lstatSync(__dirname));
    expect(icon).toEqual(['fas', 'folder']);
    // icon of file
    icon = makeIcon(__filename, fs.lstatSync(__filename));
    expect(icon).toBeTruthy();
    // icon of symlink
    const symlink = path.join(__dirname, '..', 'common', 'index.ts');
    icon = makeIcon(symlink, fs.lstatSync(symlink));
    expect(icon).toEqual(['fas', 'external-link-alt']);
    // fake icon of file with no ext
    icon = makeIcon('/this/that', fs.lstatSync(__filename));
    expect(icon).toEqual(['far', 'file']);
  });
});
