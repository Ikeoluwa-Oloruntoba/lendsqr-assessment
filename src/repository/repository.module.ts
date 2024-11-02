import { Global, Module } from '@nestjs/common';
import { Knex } from 'knex';
import { UserRepository } from './knex/user.repository';
import { TransactionsRepository } from './knex/transaction.repository';
import { SnapshotsRepository } from './knex/snapshot.repository';
import { TokensRepository } from './knex/tokens.repository';
import { KnexModule } from 'nest-knexjs';
import { MYSQLDB_DATABASE, MYSQLDB_HOST, MYSQLDB_LOCAL_PORT, MYSQLDB_PASSWORD, MYSQLDB_USER } from 'src/config/env.config';

@Global()
@Module({
  imports:[
    KnexModule.forRoot({config:{
      client: 'mysql2',
      version: '8.0',
      connection: {
        host: MYSQLDB_HOST,
        port: MYSQLDB_LOCAL_PORT,
        user: MYSQLDB_USER,
        password: MYSQLDB_PASSWORD,
        database: MYSQLDB_DATABASE,
        ssl: false
      },
      migrations: {
        tableName: 'knex_migrations'
      },
    }
    }),
  ],
  providers: [
    UserRepository,
    TransactionsRepository,
    SnapshotsRepository,
    TokensRepository,
  ],
  exports: [
    UserRepository,
    TransactionsRepository,
    SnapshotsRepository,
    TokensRepository,
  ],
})
export class RepositoryModule {}
