import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
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

const PLANS: Record<string, PlanConfig> = {
  FREE: { name: 'Free', maxRequestsPerMonth: 1_000, maxLlmCallsPerDay: 10, features: ['heuristic'] },
  PRO: { name: 'Pro', maxRequestsPerMonth: 100_000, maxLlmCallsPerDay: 1_000, features: ['heuristic', 'ml', 'llm', 'dlp', 'honeypot'] },
  BUSINESS: { name: 'Business', maxRequestsPerMonth: 1_000_000, maxLlmCallsPerDay: 10_000, features: ['heuristic', 'ml', 'llm', 'dlp', 'honeypot', 'auto_remediate'] },
  ENTERPRISE: { name: 'Enterprise', maxRequestsPerMonth: -1, maxLlmCallsPerDay: -1, features: ['*'] },
};

@Injectable()
export class BillingService {
  // private readonly logger = new Logger(BillingService.name);
  private readonly redis: Redis;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const redisUrl = this.config.get<string>('redisUrl') || 'redis://localhost:6379';
    this.redis = new Redis(redisUrl);
  }

  async checkQuota(tenantId: string): Promise<QuotaCheck> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    const planKey = (tenant?.plan as string) || 'FREE';
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

  async incrementUsage(tenantId: string): Promise<void> {
    const monthKey = `sentinel:quota:requests:${tenantId}:${new Date().toISOString().slice(0, 7)}`;
    try {
      await this.redis.incr(monthKey);
      await this.redis.expire(monthKey, 86400 * 35); // ~35 days
    } catch {
      // Ignore tracking errors
    }
  }

  async checkLlmQuota(tenantId: string): Promise<QuotaCheck> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    const planKey = (tenant?.plan as string) || 'FREE';
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

  async incrementLlmUsage(tenantId: string): Promise<void> {
    const dayKey = `sentinel:quota:llm:${tenantId}:${new Date().toISOString().slice(0, 10)}`;
    try {
      await this.redis.incr(dayKey);
      await this.redis.expire(dayKey, 86400 * 2);
    } catch {
      // Ignore
    }
  }

  async getPlan(tenantId: string): Promise<PlanConfig> {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    const planKey = (tenant?.plan as string) || 'FREE';
    return PLANS[planKey] || PLANS.FREE;
  }

  async hasFeature(tenantId: string, feature: string): Promise<boolean> {
    const plan = await this.getPlan(tenantId);
    return plan.features.includes('*') || plan.features.includes(feature);
  }
}
