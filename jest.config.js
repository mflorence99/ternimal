const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/common/**/*.ts',
    '<rootDir>/main/**/*.ts',
    '<rootDir>/renderer/app/**/*.ts',
    '!<rootDir>/renderer/app/**/barrel.ts',
    '!<rootDir>/renderer/app/**/icons.ts',
    '!<rootDir>/renderer/app/**/module.ts'
  ],
  coverageReporters: ['json-summary', 'text', 'html'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || { }, {
    prefix: '<rootDir>/'
  }),
  preset: 'jest-preset-angular',
  reporters: ['default', ['jest-junit', { outputDirectory: './reports/junit' } ]],
  roots: ['<rootDir>/common/', '<rootDir>/main/', '<rootDir>/renderer/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  testResultsProcessor: 'jest-junit',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },  
  transformIgnorePatterns: ['^.+\\.js$'],
  setupFilesAfterEnv: ['<rootDir>/renderer/test.ts']
};
