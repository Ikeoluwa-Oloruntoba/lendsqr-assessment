import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WalletService } from '../wallet/wallets.service';
import { TransferFundsDto } from './dto/transfer.dto';
import { WithdrawFundsDto } from './dto/withdrawal.dto';
import { TRANSACTION_TYPE } from 'src/common/constants/transaction.type';
import Redlock from 'redlock';
import { LockService } from 'src/integrations/redlock/redlock.service';

@Injectable()
export class WithdrawalService {

  private readonly lockTTL = 15000;

  constructor(
      private readonly walletService: WalletService,
      private readonly lockService: LockService
    ) {}

  async transferFunds(user: any, data: TransferFundsDto): Promise<void> {

    const lockKey = `wallet:lock:${user.id}`

    const lock = await this.lockService.acquireLock(lockKey, this.lockTTL);
      
     try{

      const { amount, toUserId } = data;

      await this.walletService.validateAmount(amount);

      const fromUser = await this.walletService.checkUserExistence(user.email);

      await this.walletService.validateTransactionLimit(fromUser, amount, TRANSACTION_TYPE.DEBIT)
  
      const toUser = await this.walletService.checkUserExistence(toUserId);

      await this.walletService.validateTransactionLimit(toUser, amount, TRANSACTION_TYPE.CREDIT)

      await this.walletService.checkIfBalanceIsSufficient(user.id, amount)
  
      await this.walletService.handleTransaction(user.id, amount, TRANSACTION_TYPE.DEBIT);
  
      await this.walletService.handleTransaction(toUser.id, amount, TRANSACTION_TYPE.CREDIT);

    } finally {

      await this.lockService.releaseLock(lock);
    } 
  
  }
  
    async withdrawFunds(user: any, data: WithdrawFundsDto): Promise<void> {

    const lockKey = `wallet:lock:${user.id}`

    const lock = await this.lockService.acquireLock(lockKey, this.lockTTL);
    
    try{

      const { amount } = data;

      const userData = await this.walletService.checkUserExistence(user.email);
 
      await this.walletService.validateAmount(amount);

      await this.walletService.validateTransactionLimit(userData, amount, TRANSACTION_TYPE.DEBIT)

      await this.walletService.checkIfBalanceIsSufficient(user.id, amount)
  
      await this.walletService.handleTransaction(user.id, amount, TRANSACTION_TYPE.DEBIT);

    } finally {

      await this.lockService.releaseLock(lock);

    } 
  
  }
}
