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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stripe_1 = __importDefault(require("stripe"));
const prisma_service_1 = require("../../prisma/prisma.service");
let BillingController = class BillingController {
    prisma;
    stripe;
    constructor(prisma) {
        this.prisma = prisma;
        const secretKey = process.env.STRIPE_SECRET_KEY || '';
        this.stripe = new stripe_1.default(secretKey, { apiVersion: '2024-12-18.acacia', typescript: true });
        if (process.env.NODE_ENV === 'production' && secretKey.startsWith('sk_test_')) {
            console.warn('[Stripe] WARNING: Using test key in production environment');
        }
    }
    async createCheckoutSession(apiKey, body) {
        if (!apiKey) {
            throw new common_1.UnauthorizedException('Missing X-Sentinel-Api-Key header');
        }
        const keyRecord = await this.prisma.apiKey.findFirst({
            where: { keyHash: apiKey, revokedAt: null },
            include: { tenant: true },
        });
        if (!keyRecord) {
            throw new common_1.UnauthorizedException('Invalid API key');
        }
        const tenant = keyRecord.tenant;
        const priceId = body.plan === 'PRO'
            ? process.env.STRIPE_PRICE_PRO
            : process.env.STRIPE_PRICE_ENTERPRISE;
        if (!priceId) {
            throw new common_1.BadRequestException(`Price ID not configured for plan ${body.plan}`);
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
    async createPortalSession(apiKey) {
        if (!apiKey) {
            throw new common_1.UnauthorizedException('Missing X-Sentinel-Api-Key header');
        }
        const keyRecord = await this.prisma.apiKey.findFirst({
            where: { keyHash: apiKey, revokedAt: null },
            include: { tenant: true },
        });
        if (!keyRecord?.tenant?.stripeCustomerId) {
            throw new common_1.UnauthorizedException('No subscription found');
        }
        const session = await this.stripe.billingPortal.sessions.create({
            customer: keyRecord.tenant.stripeCustomerId,
            return_url: 'https://sentinel-ai.one/pricing',
        });
        return { url: session.url };
    }
};
exports.BillingController = BillingController;
__decorate([
    (0, common_1.Post)('checkout'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Stripe Checkout session' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Checkout URL returned' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid API key' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Headers)('x-sentinel-api-key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createCheckoutSession", null);
__decorate([
    (0, common_1.Post)('portal'),
    (0, swagger_1.ApiOperation)({ summary: 'Create Stripe Customer Portal session' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Portal URL returned' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No subscription found' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Headers)('x-sentinel-api-key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BillingController.prototype, "createPortalSession", null);
exports.BillingController = BillingController = __decorate([
    (0, swagger_1.ApiTags)('Billing'),
    (0, common_1.Controller)('v1/billing'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map