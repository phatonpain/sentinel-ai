import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { RequestContext } from '@sentinel/shared-types';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  burstMax: number;
  blockDurationMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
  windowMs: number;
  retryAfterMs?: number;
  burstDetected?: boolean;
}

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);
  private readonly redis: Redis;
  private readonly defaultConfig: RateLimitConfig;

  constructor(private readonly config: ConfigService) {
    const redisUrl = this.config.get<string>('redisUrl') || 'redis://localhost:6379';
    this.redis = new Redis(redisUrl);
    this.defaultConfig = {
      windowMs: 60_000,
      maxRequests: 100,
      burstMax: 20,
      blockDurationMs: 300_000,
    };
  }

  async check(ctx: RequestContext, config?: Partial<RateLimitConfig>): Promise<RateLimitResult> {
    const cfg: RateLimitConfig = { ...this.defaultConfig, ...config };
    const identity = ctx.apiKey || ctx.sourceIp || 'anonymous';
    const tenantId = ctx.tenantId || 'default';
    const key = `sentinel:ratelimit:${tenantId}:${identity}:${ctx.method}:${ctx.path}`;
    const burstKey = `sentinel:burst:${tenantId}:${identity}`;
    const blockKey = `sentinel:block:${tenantId}:${identity}`;
    const now = Date.now();

    // 1. Check if already blocked
    const blockedUntil = await this.redis.get(blockKey);
    if (blockedUntil) {
      const until = parseInt(blockedUntil, 10);
      if (until > now) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: until,
          limit: cfg.maxRequests,
          windowMs: cfg.windowMs,
          retryAfterMs: until - now,
        };
      }
      await this.redis.del(blockKey);
    }

    // 2. Sliding window using Redis sorted set
    const windowStart = now - cfg.windowMs;
    const pipeline = this.redis.pipeline();
    pipeline.zremrangebyscore(key, 0, windowStart);
    pipeline.zcard(key);
    const [, [, currentCount]] = await pipeline.exec() as [any, [null, number]];

    if (currentCount >= cfg.maxRequests) {
      // Block the identity
      await this.redis.set(blockKey, String(now + cfg.blockDurationMs), 'PX', cfg.blockDurationMs);
      this.logger.warn({
        msg: 'Rate limit exceeded — identity blocked',
        tenantId,
        identity: this.maskIdentity(identity),
        path: ctx.path,
      });
      return {
        allowed: false,
        remaining: 0,
        resetAt: now + cfg.blockDurationMs,
        limit: cfg.maxRequests,
        windowMs: cfg.windowMs,
        retryAfterMs: cfg.blockDurationMs,
      };
    }

    // 3. Record this request
    await this.redis.zadd(key, now, `${now}:${ctx.requestId}`);
    await this.redis.pexpire(key, cfg.windowMs);

    // 4. Burst detection: count requests in last 1s
    const burstStart = now - 1000;
    const burstCount = await this.redis.zcount(burstKey, burstStart, '+inf');
    await this.redis.zadd(burstKey, now, `${now}:${ctx.requestId}`);
    await this.redis.pexpire(burstKey, 5000);

    const burstDetected = burstCount >= cfg.burstMax;
    if (burstDetected) {
      this.logger.warn({
        msg: 'Burst detected',
        tenantId,
        identity: this.maskIdentity(identity),
        burstCount,
      });
    }

    return {
      allowed: true,
      remaining: Math.max(0, cfg.maxRequests - currentCount - 1),
      resetAt: now + cfg.windowMs,
      limit: cfg.maxRequests,
      windowMs: cfg.windowMs,
      burstDetected,
    };
  }

  async reset(ctx: RequestContext): Promise<void> {
    const identity = ctx.apiKey || ctx.sourceIp || 'anonymous';
    const tenantId = ctx.tenantId || 'default';
    const pattern = `sentinel:ratelimit:${tenantId}:${identity}:*`;
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) await this.redis.del(...keys);
    await this.redis.del(`sentinel:block:${tenantId}:${identity}`);
    await this.redis.del(`sentinel:burst:${tenantId}:${identity}`);
  }

  private maskIdentity(id: string): string {
    if (id.length <= 8) return id;
    return id.substring(0, 4) + '****' + id.substring(id.length - 4);
  }
}
