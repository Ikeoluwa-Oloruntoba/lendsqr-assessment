import { Knex } from 'knex';

const knexOrmConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql',
    version: '8.0',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      tableName: 'knex_migrations'
    },
  },
  production: {
    client: 'mysql',
    version: '8.0',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: './seeds',
    },
  },
};

export default knexOrmConfig;
