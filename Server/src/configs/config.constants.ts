import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

export const appConfig = {
  port: process.env.APP_PORT,
};

export const typeOrmConfig: TypeOrmModule = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,

  entities: [`${__dirname}/../**/*.entity.{js,ts}`],
  synchronize: process.env.DB_SYNCHRONIZE,
};
