import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from 'src/repository/knex/transaction.repository';
import { UserRepository } from 'src/repository/knex/user.repository';
import { WalletService } from '../wallet/wallets.service';
import { TRANSACTION_TYPE } from 'src/common/constants/transaction.type';

@Injectable()
export class DepositService {

  constructor(
    private readonly transactionsRepository: TransactionsRepository,
    private readonly walletService: WalletService,
  ) {}

  async fundAccount(user: any, amount: number): Promise<void> {
      // Validate the amount
      await this.walletService.validateAmount(amount);

      const userData = await this.walletService.checkUserExistence(user.email);

      await this.walletService.validateTransactionLimit(userData, amount, TRANSACTION_TYPE.CREDIT)
  
      // Create a transaction record
      await this.walletService.handleTransaction(user.id, amount, TRANSACTION_TYPE.CREDIT)
    }
}
