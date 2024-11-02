import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletService } from '../wallet/wallets.service';
import { TransferFundsDto } from './dto/transfer.dto';
import { WithdrawFundsDto } from './dto/withdrawal.dto';
import { TRANSACTION_TYPE } from 'src/common/constants/transaction.type';

@Injectable()
export class WithdrawalService {

    constructor(
        private readonly walletService: WalletService,
      ) {}

    async transferFunds(user: any, data: TransferFundsDto): Promise<void> {
       
        const { amount, toUserId } = data;

        await this.walletService.validateAmount(amount);
        // Check if both users exist
        const fromUser = await this.walletService.checkUserExistence(user.email);

        await this.walletService.validateTransactionLimit(fromUser, amount, TRANSACTION_TYPE.DEBIT)
    
        const toUser = await this.walletService.checkUserExistence(toUserId);

        await this.walletService.validateTransactionLimit(toUser, amount, TRANSACTION_TYPE.CREDIT)

        await this.walletService.checkIfBalanceIsSufficient(user.id, amount)
    
        // Create a debit transaction for the sender
        await this.walletService.handleTransaction(user.id, amount, TRANSACTION_TYPE.DEBIT);
    
        // Create a credit transaction for the recipient
        await this.walletService.handleTransaction(toUser.id, amount, TRANSACTION_TYPE.CREDIT);
    
      }
    
      async withdrawFunds(user: any, data: WithdrawFundsDto): Promise<void> {

        const { amount } = data;

        const userData = await this.walletService.checkUserExistence(user.email);
        // Validate the amount
        await this.walletService.validateAmount(amount);

        await this.walletService.validateTransactionLimit(userData, amount, TRANSACTION_TYPE.DEBIT)
        // Check user's current balance (consider implementing a method to get the current balance)
        await this.walletService.checkIfBalanceIsSufficient(user.id, amount)
    
        // Create a debit transaction for the user
        await this.walletService.handleTransaction(user.id, amount, TRANSACTION_TYPE.DEBIT);
    
    
      }
}
