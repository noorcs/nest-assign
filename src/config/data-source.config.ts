import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  //   logging: true,
  entities: [`${__dirname}/../**/entities/*.entity{.ts,.js}`], //regix for entity loading
  migrations: [`${__dirname}/../**/migrations/*.{ts,js}`],
  subscribers: [`${__dirname}/../**/*.subscriber{.ts,.js}`],
  synchronize: false, //always do this false otherwise this will alter the table according to import entities.
};

export const AppDataSource = new DataSource(databaseConfig);
