import { Module } from '@nestjs/common';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { DepositModule } from './modules/deposit/deposit.module';
import { WithdrawalModule } from './modules/withdrawal/withdrawal.module';
import { AuthModule } from './modules/auth/auth.module';
import knexOrmConfig from './config/knexorm.config';
import { RepositoryModule } from './repository/repository.module';
import { IntegrationModule } from './integrations/integration.module';
import { ConfigModule } from '@nestjs/config';
import { WalletsModule } from './modules/wallet/wallets.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    OnboardingModule, 
    DepositModule, 
    WithdrawalModule, 
    RepositoryModule,
    IntegrationModule,
    AuthModule,
    WalletsModule,
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),

    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
})
export class AppModule {}
