import * as fs from 'fs-extra';
import * as path from 'path';

/* eslint-disable @typescript-eslint/naming-convention */
const coveragePath = path.join(
  __dirname,
  '..',
  'coverage',
  'coverage-summary.json'
);
const coverage = JSON.parse(
  fs.readFileSync(coveragePath, { encoding: 'utf8' })
);

const readmePath = path.join(__dirname, '..', 'README.md');
const readme_md = fs.readFileSync(readmePath, { encoding: 'utf8' });

fs.writeFileSync(
  readmePath,
  readme_md.replace(
    /coverage-[0-9.]+%25-blue/gm,
    `coverage-${coverage.total.statements.pct}%25-blue`
  )
);
