import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { StripeWebhookController } from './stripe-webhook.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BillingService],
  controllers: [StripeWebhookController],
  exports: [BillingService],
})
export class BillingModule {}
