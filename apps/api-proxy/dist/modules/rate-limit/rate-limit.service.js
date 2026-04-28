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
var RateLimitService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let RateLimitService = RateLimitService_1 = class RateLimitService {
    config;
    logger = new common_1.Logger(RateLimitService_1.name);
    redis;
    defaultConfig;
    constructor(config) {
        this.config = config;
        const redisUrl = this.config.get('redisUrl') || 'redis://localhost:6379';
        this.redis = new ioredis_1.default(redisUrl);
        this.defaultConfig = {
            windowMs: 60_000,
            maxRequests: 100,
            burstMax: 20,
            blockDurationMs: 300_000,
        };
    }
    async check(ctx, config) {
        const cfg = { ...this.defaultConfig, ...config };
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
        const [, [, currentCount]] = await pipeline.exec();
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
    async reset(ctx) {
        const identity = ctx.apiKey || ctx.sourceIp || 'anonymous';
        const tenantId = ctx.tenantId || 'default';
        const pattern = `sentinel:ratelimit:${tenantId}:${identity}:*`;
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0)
            await this.redis.del(...keys);
        await this.redis.del(`sentinel:block:${tenantId}:${identity}`);
        await this.redis.del(`sentinel:burst:${tenantId}:${identity}`);
    }
    maskIdentity(id) {
        if (id.length <= 8)
            return id;
        return id.substring(0, 4) + '****' + id.substring(id.length - 4);
    }
};
exports.RateLimitService = RateLimitService;
exports.RateLimitService = RateLimitService = RateLimitService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RateLimitService);
//# sourceMappingURL=rate-limit.service.js.map