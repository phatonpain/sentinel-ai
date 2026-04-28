import { Controller, Post, Headers, BadRequestException, RawBody, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('v1/webhooks/stripe')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);
  private readonly stripe: any;
  private readonly webhookSecret: string;

  constructor(private readonly prisma: PrismaService) {
    const secretKey = process.env.STRIPE_SECRET_KEY || '';
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    this.stripe = new (Stripe as any)(secretKey, { apiVersion: '2024-12-18.acacia', typescript: true });

    if (process.env.NODE_ENV === 'production' && secretKey.startsWith('sk_test_')) {
      throw new Error('STRIPE_SECRET_KEY is a test key in production environment!');
    }
  }

  @Post()
  async handleWebhook(
    @RawBody() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    if (!this.webhookSecret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    let event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    } catch (err: any) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    this.logger.log(`Stripe event received: ${event.type}`);

    switch (event.type) {
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        await this.handlePaymentSucceeded(invoice);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await this.handlePaymentFailed(invoice);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await this.handleSubscriptionDeleted(subscription);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await this.handleSubscriptionUpdated(subscription);
        break;
      }
      default:
        this.logger.log(`Unhandled Stripe event: ${event.type}`);
    }

    return { received: true };
  }

  private async handlePaymentSucceeded(invoice: any) {
    const tenantId = invoice.subscription_details?.metadata?.tenantId;
    if (!tenantId) {
      this.logger.warn('No tenantId in invoice metadata');
      return;
    }
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'ACTIVE' },
    });
    this.logger.log(`Tenant ${tenantId} activated after payment`);
  }

  private async handlePaymentFailed(invoice: any) {
    const tenantId = invoice.subscription_details?.metadata?.tenantId;
    if (!tenantId) return;
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'SUSPENDED' },
    });
    this.logger.warn(`Tenant ${tenantId} suspended after payment failure`);
  }

  private async handleSubscriptionDeleted(subscription: any) {
    const tenantId = subscription.metadata?.tenantId;
    if (!tenantId) return;
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { plan: 'FREE', status: 'ACTIVE' },
    });
    this.logger.log(`Tenant ${tenantId} downgraded to FREE`);
  }

  private async handleSubscriptionUpdated(subscription: any) {
    const tenantId = subscription.metadata?.tenantId;
    if (!tenantId) return;
    const priceId = subscription.items?.data?.[0]?.price?.id;
    const planMap: Record<string, string> = {
      [process.env.STRIPE_PRICE_ID_PRO || '']: 'PRO',
      [process.env.STRIPE_PRICE_ID_BUSINESS || '']: 'BUSINESS',
      [process.env.STRIPE_PRICE_ID_ENTERPRISE || '']: 'ENTERPRISE',
    };
    const plan = planMap[priceId || ''] || 'FREE';
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { plan: plan as any },
    });
    this.logger.log(`Tenant ${tenantId} plan updated to ${plan}`);
  }
}
