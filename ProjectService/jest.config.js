/** @type {import('ts-jest').JestConfigWithTsJest} **/
export const testEnvironment = "node";
export const testPathIgnorePatterns = ['/node_modules/', '/dist/'];
export const preset = 'ts-jest';
export const transform = {
  '^.+\\.tsx?$': 'ts-jest',
  '^.+\\.jsx?$': 'babel-jest',
};
export const transformIgnorePatterns = [
  '/node_modules/(?!chai/)',
];
export const moduleFileExtensions = ['ts', 'tsx', 'js', 'jsx', 'json', 'node'];