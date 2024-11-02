import { Global, Module } from '@nestjs/common';
import { Knex } from 'knex';
import { UserRepository } from './knex/user.repository';
import { TransactionsRepository } from './knex/transaction.repository';
import { SnapshotsRepository } from './knex/snapshot.repository';
import { TokensRepository } from './knex/tokens.repository';
import { KnexModule } from 'nest-knexjs';

@Global()
@Module({
  imports:[
    KnexModule.forRoot({config:{
      client: 'mysql2',
      version: '8.0',
      connection: {
        host: 'democredit-db.demo-credit.orb.local',
        port: 3306,
        user: 'lendsqr',
        password: 'password',
        database: 'demoCredit',
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
