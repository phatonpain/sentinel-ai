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
      console.warn('[Stripe] WARNING: Using test key in production environment');
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
      case 'checkout.session.completed': {
        const session = event.data.object;
        await this.handleCheckoutCompleted(session);
        break;
      }
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

  private async handleCheckoutCompleted(session: any) {
    const tenantId = session.metadata?.tenantId;
    const plan = session.metadata?.plan;

    if (!tenantId || !plan) {
      this.logger.warn('Missing tenantId or plan in checkout session metadata');
      return;
    }

    const requestLimit =
      plan === 'GUARDIAN' || plan === 'PRO' ? 5000 :
      plan === 'SENTINEL' ? 25000 :
      plan === 'ENTERPRISE' ? 1000000 : 100;

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        plan: plan,
        billingStatus: 'ACTIVE',
        requestLimit: requestLimit,
      },
    });

    this.logger.log(`Tenant ${tenantId} upgraded to ${plan} via checkout`);
  }

  private async handlePaymentSucceeded(invoice: any) {
    const tenantId = invoice.subscription_details?.metadata?.tenantId;
    if (!tenantId) {
      this.logger.warn('No tenantId in invoice metadata');
      return;
    }
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'ACTIVE', billingStatus: 'ACTIVE' },
    });
    this.logger.log(`Tenant ${tenantId} activated after payment`);
  }

  private async handlePaymentFailed(invoice: any) {
    const tenantId = invoice.subscription_details?.metadata?.tenantId;
    if (!tenantId) return;
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { billingStatus: 'PAST_DUE' },
    });
    this.logger.warn(`Tenant ${tenantId} marked past due after payment failure`);
  }

  private async handleSubscriptionDeleted(subscription: any) {
    const tenantId = subscription.metadata?.tenantId;
    if (!tenantId) {
      // Fallback: try to find by subscription ID
      const tenant = await this.prisma.tenant.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });
      if (tenant) {
        await this.prisma.tenant.update({
          where: { id: tenant.id },
          data: { plan: 'FREE', billingStatus: 'CANCELED', requestLimit: 100 },
        });
        this.logger.log(`Tenant ${tenant.id} downgraded to FREE (found by subscriptionId)`);
      }
      return;
    }
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { plan: 'FREE', billingStatus: 'CANCELED', requestLimit: 100 },
    });
    this.logger.log(`Tenant ${tenantId} downgraded to FREE`);
  }

  private async handleSubscriptionUpdated(subscription: any) {
    const tenantId = subscription.metadata?.tenantId;
    if (!tenantId) {
      // Fallback: try to find by subscription ID
      const tenant = await this.prisma.tenant.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });
      if (!tenant) return;
      await this.updateTenantPlan(tenant.id, subscription);
      return;
    }
    await this.updateTenantPlan(tenantId, subscription);
  }

  private async updateTenantPlan(tenantId: string, subscription: any) {
    const priceId = subscription.items?.data?.[0]?.price?.id;
    const planMap: Record<string, string> = {
      [process.env.STRIPE_PRICE_GUARDIAN || process.env.STRIPE_PRICE_PRO || '']: 'GUARDIAN',
      [process.env.STRIPE_PRICE_SENTINEL || process.env.STRIPE_PRICE_ENTERPRISE || '']: 'SENTINEL',
      [process.env.STRIPE_PRICE_ENTERPRISE || '']: 'ENTERPRISE',
    };
    const plan = planMap[priceId || ''];
    if (!plan) return;

    const requestLimit =
      plan === 'GUARDIAN' || plan === 'PRO' ? 5000 :
      plan === 'SENTINEL' ? 25000 :
      plan === 'ENTERPRISE' ? 1000000 : 100;

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { plan: plan as any, requestLimit, billingStatus: 'ACTIVE' },
    });
    this.logger.log(`Tenant ${tenantId} plan updated to ${plan}`);
  }
}
