import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TransactionsRepository } from '../../repository/knex/transaction.repository';
import { SnapshotsRepository } from '../../repository/knex/snapshot.repository';
import { TransactionEvent } from 'src/events/transaction.event';
import { UserRepository } from 'src/repository/knex/user.repository';
import { kycLevelMap } from 'src/common/constants/kyc-level.type';
import { TRANSACTION_TYPE } from 'src/common/constants/transaction.type';



@Injectable()
export class WalletService {
  private snapshotThreshold: number;

  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly snapshotsRepository: SnapshotsRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {

    this.snapshotThreshold = this.configService.get<number>('SNAPSHOT_THRESHOLD') || 1000;
  }

  async handleTransaction(userId: string, amount: number, type: string): Promise<void> {

    await this.transactionsRepository.createTransaction({
      user_id: userId,
      amount,
      type,
      created_at: new Date(),
    });

    this.eventEmitter.emit('transaction.completed', new TransactionEvent(userId));
  }

  async validateAmount(amount: number): Promise<void> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }
  }

  async checkUserExistence(email: string){
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with ID ${email} not found`);
    }
    return user;
  }

  async validateTransactionLimit(user: any, amount: number, transactionType: string){
    const userLevel = kycLevelMap[user.account_tier];
    const limit = transactionType === TRANSACTION_TYPE.CREDIT ? userLevel.depositLimit : userLevel.withdrawalLimit;
  
    if (limit !== Infinity && amount > limit) {
      throw new BadRequestException(
        `${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} limit exceeded. Maximum allowed: ${limit}`
      );
    }
  }

  async checkIfBalanceIsSufficient(userId: string, amount: number){
    const currentBalance = await this.computeBalance(userId);
    if (currentBalance < amount) {
      throw new BadRequestException('Insufficient balance');
    }
  }

  async computeBalance(userId: string): Promise<number> {
    const lastSnapshot = await this.snapshotsRepository.getLastSnapshot(userId);
    let balance = lastSnapshot ? Number(lastSnapshot.balance ): 0;

    const transactions = await this.transactionsRepository.getUserTransactionsSinceSnapshot(
        userId,
        lastSnapshot ? lastSnapshot.id : null,
    );

    transactions.forEach((tx) => {
        if (tx.type === 'CREDIT') {
            balance += Number(tx.amount);
        } else if (tx.type === 'DEBIT') {
            balance -= Number(tx.amount);
        }
    });

    return balance;
}

  async createSnapshotIfNeeded(userId: string): Promise<void> {
    const transactionCount = await this.transactionsRepository.countTransactions(userId);

    if (transactionCount % this.snapshotThreshold === 0) {
      const balance = await this.computeBalance(userId);
      await this.snapshotsRepository.createSnapshot({
        user_id: userId,
        balance,
        transaction_count: transactionCount,
        created_at: new Date(),
      });
    }
  }
}
