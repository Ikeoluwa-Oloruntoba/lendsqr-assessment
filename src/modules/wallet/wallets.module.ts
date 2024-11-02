import { Global, Module } from '@nestjs/common';
import { WalletService } from './wallets.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Global()
@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [WalletService],
  exports: [WalletService]
})
export class WalletsModule {}
