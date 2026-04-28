import { ConfigService } from '@nestjs/config';
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
export declare class RateLimitService {
    private readonly config;
    private readonly logger;
    private readonly redis;
    private readonly defaultConfig;
    constructor(config: ConfigService);
    check(ctx: RequestContext, config?: Partial<RateLimitConfig>): Promise<RateLimitResult>;
    reset(ctx: RequestContext): Promise<void>;
    private maskIdentity;
}
//# sourceMappingURL=rate-limit.service.d.ts.map