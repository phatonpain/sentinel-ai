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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
const prisma_service_1 = require("../../prisma/prisma.service");
const PLANS = {
    FREE: { name: 'Free', maxRequestsPerMonth: 1_000, maxLlmCallsPerDay: 10, features: ['heuristic'] },
    PRO: { name: 'Pro', maxRequestsPerMonth: 100_000, maxLlmCallsPerDay: 1_000, features: ['heuristic', 'ml', 'llm', 'dlp', 'honeypot'] },
    BUSINESS: { name: 'Business', maxRequestsPerMonth: 1_000_000, maxLlmCallsPerDay: 10_000, features: ['heuristic', 'ml', 'llm', 'dlp', 'honeypot', 'auto_remediate'] },
    ENTERPRISE: { name: 'Enterprise', maxRequestsPerMonth: -1, maxLlmCallsPerDay: -1, features: ['*'] },
};
let BillingService = class BillingService {
    config;
    prisma;
    // private readonly logger = new Logger(BillingService.name);
    redis;
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        const redisUrl = this.config.get('redisUrl') || 'redis://localhost:6379';
        this.redis = new ioredis_1.default(redisUrl);
    }
    async checkQuota(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        const planKey = tenant?.plan || 'FREE';
        const plan = PLANS[planKey] || PLANS.FREE;
        // Unlimited
        if (plan.maxRequestsPerMonth < 0) {
            return { allowed: true, usage: 0, limit: -1, plan: plan.name };
        }
        const monthKey = `sentinel:quota:requests:${tenantId}:${new Date().toISOString().slice(0, 7)}`;
        const usage = parseInt((await this.redis.get(monthKey)) || '0', 10);
        const allowed = usage < plan.maxRequestsPerMonth;
        return {
            allowed,
            usage,
            limit: plan.maxRequestsPerMonth,
            plan: plan.name,
        };
    }
    async incrementUsage(tenantId) {
        const monthKey = `sentinel:quota:requests:${tenantId}:${new Date().toISOString().slice(0, 7)}`;
        try {
            await this.redis.incr(monthKey);
            await this.redis.expire(monthKey, 86400 * 35); // ~35 days
        }
        catch {
            // Ignore tracking errors
        }
    }
    async checkLlmQuota(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        const planKey = tenant?.plan || 'FREE';
        const plan = PLANS[planKey] || PLANS.FREE;
        if (plan.maxLlmCallsPerDay < 0) {
            return { allowed: true, usage: 0, limit: -1, plan: plan.name };
        }
        const dayKey = `sentinel:quota:llm:${tenantId}:${new Date().toISOString().slice(0, 10)}`;
        const usage = parseInt((await this.redis.get(dayKey)) || '0', 10);
        const allowed = usage < plan.maxLlmCallsPerDay;
        return {
            allowed,
            usage,
            limit: plan.maxLlmCallsPerDay,
            plan: plan.name,
        };
    }
    async incrementLlmUsage(tenantId) {
        const dayKey = `sentinel:quota:llm:${tenantId}:${new Date().toISOString().slice(0, 10)}`;
        try {
            await this.redis.incr(dayKey);
            await this.redis.expire(dayKey, 86400 * 2);
        }
        catch {
            // Ignore
        }
    }
    async getPlan(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        const planKey = tenant?.plan || 'FREE';
        return PLANS[planKey] || PLANS.FREE;
    }
    async hasFeature(tenantId, feature) {
        const plan = await this.getPlan(tenantId);
        return plan.features.includes('*') || plan.features.includes(feature);
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], BillingService);
//# sourceMappingURL=billing.service.js.map