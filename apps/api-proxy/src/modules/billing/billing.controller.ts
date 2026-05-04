import { Controller, Post, Body, Headers, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Billing')
@Controller('v1/billing')
export class BillingController {
  private stripe: any;

  constructor(private readonly prisma: PrismaService) {
    const secretKey = process.env.STRIPE_SECRET_KEY || '';
    this.stripe = new (Stripe as any)(secretKey, { apiVersion: '2024-12-18.acacia', typescript: true });

    if (process.env.NODE_ENV === 'production' && secretKey.startsWith('sk_test_')) {
      console.warn('[Stripe] WARNING: Using test key in production environment');
    }
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Create Stripe Checkout session' })
  @ApiResponse({ status: 200, description: 'Checkout URL returned' })
  @ApiResponse({ status: 401, description: 'Invalid API key' })
  async createCheckoutSession(
    @Headers('x-sentinel-api-key') apiKey: string,
    @Body() body: { plan: 'GUARDIAN' | 'SENTINEL' | 'ENTERPRISE' | 'PRO' },
  ) {
    if (!apiKey) {
      throw new UnauthorizedException('Missing X-Sentinel-Api-Key header');
    }

    const keyRecord = await this.prisma.apiKey.findFirst({
      where: { keyHash: apiKey, revokedAt: null },
      include: { tenant: true },
    });

    if (!keyRecord) {
      throw new UnauthorizedException('Invalid API key');
    }

    const tenant = keyRecord.tenant;
    const plan = body.plan === 'PRO' ? 'GUARDIAN' : body.plan;
    const priceId =
      plan === 'GUARDIAN'
        ? process.env.STRIPE_PRICE_GUARDIAN || process.env.STRIPE_PRICE_PRO
        : plan === 'SENTINEL'
          ? process.env.STRIPE_PRICE_SENTINEL || process.env.STRIPE_PRICE_ENTERPRISE
          : process.env.STRIPE_PRICE_ENTERPRISE;

    if (!priceId) {
      throw new BadRequestException(`Price ID not configured for plan ${body.plan}`);
    }

    const session = await this.stripe.checkout.sessions.create({
      customer_email: undefined,
      metadata: { tenantId: tenant.id, plan: body.plan },
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `https://sentinel-ai.one/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://sentinel-ai.one/pricing`,
    });

    return { url: session.url };
  }

  @Post('portal')
  @ApiOperation({ summary: 'Create Stripe Customer Portal session' })
  @ApiResponse({ status: 200, description: 'Portal URL returned' })
  @ApiResponse({ status: 401, description: 'No subscription found' })
  async createPortalSession(@Headers('x-sentinel-api-key') apiKey: string) {
    if (!apiKey) {
      throw new UnauthorizedException('Missing X-Sentinel-Api-Key header');
    }

    const keyRecord = await this.prisma.apiKey.findFirst({
      where: { keyHash: apiKey, revokedAt: null },
      include: { tenant: true },
    });

    if (!keyRecord?.tenant?.stripeCustomerId) {
      throw new UnauthorizedException('No subscription found');
    }

    const session = await this.stripe.billingPortal.sessions.create({
      customer: keyRecord.tenant.stripeCustomerId,
      return_url: 'https://sentinel-ai.one/pricing',
    });

    return { url: session.url };
  }
}
