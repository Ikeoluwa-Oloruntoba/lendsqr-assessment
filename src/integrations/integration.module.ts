import { Global, Module } from '@nestjs/common';
import { AdjutorIntegrationService } from './adjutor/adjutor.integration';

@Global()
@Module({
  providers: [AdjutorIntegrationService],
  exports: [AdjutorIntegrationService],
})
export class IntegrationModule {}
