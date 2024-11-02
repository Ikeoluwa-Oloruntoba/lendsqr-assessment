import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { TransactionHelper } from 'src/common/helpers/transaction.helper';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionsRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async createTransaction(data: any): Promise<any> {
    const transactionId = uuidv4();
    const transactionRef = TransactionHelper.generateTransactionRef();
    const transaction = { id: transactionId, reference: transactionRef, ...data };

    return await this.knex.table('transactions').insert(transaction).returning('*');
  }

  async getUserTransactionsSinceSnapshot(userId: string, lastSnapshotId: string): Promise<any[]> {
    return await this.knex.table('transactions')
      .where({ user_id: userId })
      .andWhere('id', '>', lastSnapshotId)
      .orderBy('created_at', 'asc');
  }

  async countTransactions(userId: string): Promise<number> {
    const result = await this.knex.table('transactions')
      .count('* as count')
      .where('user_id', userId)
      .first();

    return Number(result.count);
  }
}
