import { Global, Module } from '@nestjs/common';
import { AdjutorIntegrationService } from './adjutor/adjutor.integration';
import { LockService } from './redlock/redlock.service';
import { RedisService } from './redis/redis.service';

@Global()
@Module({
  providers: [AdjutorIntegrationService, LockService, RedisService],
  exports: [AdjutorIntegrationService, LockService, RedisService],
})
export class IntegrationModule {}
