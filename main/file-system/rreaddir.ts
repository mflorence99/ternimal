/* eslint-disable @typescript-eslint/no-misused-promises */
import { numParallelOps } from '../common';
import { rreaddirCacheTTL } from '../common';

import * as async from 'async';
import * as fs from 'fs-extra';
import * as path from 'path';

import NodeCache = require('node-cache');
const cache = new NodeCache({
  stdTTL: rreaddirCacheTTL
});

export const rreaddir = async (
  dirname: string,
  hash: Record<string, fs.Stats>,
  budgetCount = 0,
  budgetTime = 0
): Promise<void> => {
  // initialize budget
  let count = 0;
  const start = Date.now();
  // the recursive readdir function
  const impl = async (
    dirname: string,
    hash: Record<string, fs.Stats>
  ): Promise<void> => {
    // ENOENT is normal
    try {
      await fs.access(dirname, fs.constants.R_OK);
      const names = await fs.readdir(dirname);
      // has budget been exceeded?
      count += names.length;
      if (budgetCount && count > budgetCount)
        throw new Error(`${count} files from a budget of ${budgetCount} found`);
      const time = Date.now() - start;
      if (budgetTime && time > budgetTime)
        throw new Error(`${time}ms from a budget of ${budgetTime}ms used`);
      // no? continue recursive readdir
      const paths = names.map((name) => path.join(dirname, name));
      Object.assign(hash, await statsByPath(paths));
      for (const name of paths) {
        if (hash[name].isDirectory()) await impl(name, hash);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  };
  // start the ball rolling
  // NOTE: we cache failing directories for a while to avoid
  // reading and failing over and over
  try {
    const error: string = cache.get(dirname);
    if (!error) await impl(dirname, hash);
  } catch (error) {
    // don't cache EACCES errors as these may be fixed quickly
    if (error.code !== 'EACCES') cache.set(dirname, error.message);
    Object.keys(hash).forEach((key) => delete hash[key]);
    throw error;
  }
};

export const statsByPath = async (
  paths: string[]
): Promise<Record<string, fs.Stats>> => {
  const hash = Object.fromEntries(paths.map((path) => [path, path]));
  return await async.mapValuesLimit(hash, numParallelOps, fs.lstat);
};
