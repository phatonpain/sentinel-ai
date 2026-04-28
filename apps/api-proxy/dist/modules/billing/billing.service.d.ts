import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export interface QuotaCheck {
    allowed: boolean;
    usage: number;
    limit: number;
    plan: string;
    resetAt?: number;
}
export interface PlanConfig {
    name: string;
    maxRequestsPerMonth: number;
    maxLlmCallsPerDay: number;
    features: string[];
}
export declare class BillingService {
    private readonly config;
    private readonly prisma;
    private readonly redis;
    constructor(config: ConfigService, prisma: PrismaService);
    checkQuota(tenantId: string): Promise<QuotaCheck>;
    incrementUsage(tenantId: string): Promise<void>;
    checkLlmQuota(tenantId: string): Promise<QuotaCheck>;
    incrementLlmUsage(tenantId: string): Promise<void>;
    getPlan(tenantId: string): Promise<PlanConfig>;
    hasFeature(tenantId: string, feature: string): Promise<boolean>;
}
//# sourceMappingURL=billing.service.d.ts.map