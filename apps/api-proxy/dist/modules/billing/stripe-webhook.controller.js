"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StripeWebhookController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeWebhookController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const stripe_1 = __importDefault(require("stripe"));
const prisma_service_1 = require("../../prisma/prisma.service");
let StripeWebhookController = StripeWebhookController_1 = class StripeWebhookController {
    prisma;
    logger = new common_1.Logger(StripeWebhookController_1.name);
    stripe;
    webhookSecret;
    constructor(prisma) {
        this.prisma = prisma;
        const secretKey = process.env.STRIPE_SECRET_KEY || '';
        this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
        this.stripe = new stripe_1.default(secretKey, { apiVersion: '2024-12-18.acacia', typescript: true });
        if (process.env.NODE_ENV === 'production' && secretKey.startsWith('sk_test_')) {
            console.warn('[Stripe] WARNING: Using test key in production environment');
        }
    }
    async handleWebhook(rawBody, signature) {
        if (!signature) {
            throw new common_1.BadRequestException('Missing stripe-signature header');
        }
        if (!this.webhookSecret) {
            throw new common_1.BadRequestException('Webhook secret not configured');
        }
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook signature verification failed: ${err.message}`);
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
    async handleCheckoutCompleted(session) {
        const tenantId = session.metadata?.tenantId;
        const plan = session.metadata?.plan;
        if (!tenantId || !plan) {
            this.logger.warn('Missing tenantId or plan in checkout session metadata');
            return;
        }
        const requestLimit = plan === 'PRO' ? 1000 : plan === 'ENTERPRISE' ? 10000 : 100;
        await this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                stripeCustomerId: session.customer,
                stripeSubscriptionId: session.subscription,
                plan: plan,
                billingStatus: 'ACTIVE',
                requestLimit: requestLimit,
            },
        });
        this.logger.log(`Tenant ${tenantId} upgraded to ${plan} via checkout`);
    }
    async handlePaymentSucceeded(invoice) {
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
    async handlePaymentFailed(invoice) {
        const tenantId = invoice.subscription_details?.metadata?.tenantId;
        if (!tenantId)
            return;
        await this.prisma.tenant.update({
            where: { id: tenantId },
            data: { billingStatus: 'PAST_DUE' },
        });
        this.logger.warn(`Tenant ${tenantId} marked past due after payment failure`);
    }
    async handleSubscriptionDeleted(subscription) {
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
    async handleSubscriptionUpdated(subscription) {
        const tenantId = subscription.metadata?.tenantId;
        if (!tenantId) {
            // Fallback: try to find by subscription ID
            const tenant = await this.prisma.tenant.findFirst({
                where: { stripeSubscriptionId: subscription.id },
            });
            if (!tenant)
                return;
            await this.updateTenantPlan(tenant.id, subscription);
            return;
        }
        await this.updateTenantPlan(tenantId, subscription);
    }
    async updateTenantPlan(tenantId, subscription) {
        const priceId = subscription.items?.data?.[0]?.price?.id;
        const planMap = {
            [process.env.STRIPE_PRICE_PRO || '']: 'PRO',
            [process.env.STRIPE_PRICE_ENTERPRISE || '']: 'ENTERPRISE',
        };
        const plan = planMap[priceId || ''];
        if (!plan)
            return;
        const requestLimit = plan === 'PRO' ? 1000 : plan === 'ENTERPRISE' ? 10000 : 100;
        await this.prisma.tenant.update({
            where: { id: tenantId },
            data: { plan: plan, requestLimit, billingStatus: 'ACTIVE' },
        });
        this.logger.log(`Tenant ${tenantId} plan updated to ${plan}`);
    }
};
exports.StripeWebhookController = StripeWebhookController;
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.RawBody)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Buffer, String]),
    __metadata("design:returntype", Promise)
], StripeWebhookController.prototype, "handleWebhook", null);
exports.StripeWebhookController = StripeWebhookController = StripeWebhookController_1 = __decorate([
    (0, common_1.Controller)('v1/webhooks/stripe'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StripeWebhookController);
//# sourceMappingURL=stripe-webhook.controller.js.map