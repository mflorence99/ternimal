const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/main/**/*.ts',
    '<rootDir>/renderer/app/**/*.ts',
    '!<rootDir>/renderer/app/**/barrel.ts',
    '!<rootDir>/renderer/app/**/icons.ts',
    '!<rootDir>/renderer/app/**/module.ts'
  ],
  coverageReporters: ['json-summary', 'text', 'html'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/'
  }),
  preset: 'jest-preset-angular',
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './reports/junit' }]
  ],
  roots: [
    '<rootDir>/main/',
    '<rootDir>/renderer/app/components',
    '<rootDir>/renderer/app/directives',
    '<rootDir>/renderer/app/pages/directives',
    '<rootDir>/renderer/app/pipes',
    '<rootDir>/renderer/app/services',
    '<rootDir>/renderer/app/state'
  ],
  setupFilesAfterEnv: [
    'jest-canvas-mock',
    'jest-extended',
    '<rootDir>/renderer/test.ts'
  ],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  testResultsProcessor: 'jest-junit',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: ['^.+\\.js$']
};
