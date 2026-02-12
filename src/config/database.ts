import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'false',
  logging: process.env.TYPEORM_LOGGING === 'false',
  entities: ['src/db/entities/**/*.ts'],
  migrations: ['src/db/migrations/**/*.ts'],
});