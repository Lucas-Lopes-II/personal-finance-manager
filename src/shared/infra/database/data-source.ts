import { IEnvConfig } from './../../domain/env';
import { DataSource, DataSourceOptions } from 'typeorm';
import { envConfigFactory } from '../env';

const envConfig: IEnvConfig = envConfigFactory();
const env = envConfig.getNodeEnv();
const testEnv = env === 'test';

export const options: DataSourceOptions = {
  type: 'postgres',
  host: envConfig.getDbHost(),
  port: envConfig.getDBPort(),
  username: envConfig.getDbUserName(),
  password: envConfig.getDbPassword(),
  database: envConfig.getDbName(),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/shared/infra/database/migrations/*{.ts,.js}'],
  synchronize: false,
};
export const optionsTest: DataSourceOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: ['src/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export const dataSource = new DataSource(testEnv ? optionsTest : options);
