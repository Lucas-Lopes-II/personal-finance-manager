import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testRegex: ['.*\\..*spec\\.ts$', '.*\\..*test\\.ts$', '.*\\..*e2e\\.ts$'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/src/shared/infra/database/migrations/',
    '.entity.ts',
    '.interface.ts',
    '.module.ts',
    '.mock.ts',
    '.dto.ts',
    '.factory.ts',
    'main.ts',
    'index.ts',
    '.js',
    'jest.config.ts',
    'migration.ts',
    'data-source.ts',
    'initialize-database-connection.ts',
    'entity-typeorm.ts',
    '.filter.ts',
    '.guard.ts',
    '.strategy.ts',
    '.decorator.ts',
    '-error.ts',
    '.+/infra/main/.*\\.controller\\.ts$',
    '.+/infra/controllers/.*\\.controller\\.ts$',
  ],
};
