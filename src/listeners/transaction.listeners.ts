import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { TransactionEvent } from '../events/transaction.event';
import { WalletService } from 'src/modules/wallet/wallets.service';

@Injectable()
export class TransactionListener {

  constructor(private readonly walletService: WalletService) {}

 
  @OnEvent('transaction.completed')
  async handleTransactionCompleted(event: TransactionEvent): Promise<void> {
    const { userId } = event;

    await this.walletService.createSnapshotIfNeeded(userId);
  }
}
