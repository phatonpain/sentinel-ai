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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const rate_limit_service_1 = require("../modules/rate-limit/rate-limit.service");
let RateLimitGuard = class RateLimitGuard {
    prisma;
    rateLimitService;
    constructor(prisma, rateLimitService) {
        this.prisma = prisma;
        this.rateLimitService = rateLimitService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const tenantId = request.tenantId;
        if (!tenantId) {
            return true; // Allow if no tenant (fallback)
        }
        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        if (!tenant) {
            return true;
        }
        const limit = tenant.requestLimit || 100;
        const result = await this.rateLimitService.check({
            tenantId,
            apiKey: request.headers['x-sentinel-api-key'] || 'anonymous',
            sourceIp: request.ip || request.connection?.remoteAddress || 'unknown',
            method: request.method,
            path: request.path || request.route?.path || '/',
            requestId: request.requestId || `${Date.now()}`,
            timestamp: new Date().toISOString(),
            query: request.query || {},
            headers: request.headers || {},
            userAgent: request.headers['user-agent'] || 'unknown',
        }, {
            windowMs: 60_000,
            maxRequests: limit,
            burstMax: Math.ceil(limit / 5),
            blockDurationMs: 60_000,
        });
        // Attach rate limit headers to response
        const response = context.switchToHttp().getResponse();
        response.setHeader('X-RateLimit-Limit', result.limit);
        response.setHeader('X-RateLimit-Remaining', result.remaining);
        response.setHeader('X-RateLimit-Reset', Math.ceil(result.resetAt / 1000));
        if (!result.allowed) {
            throw new common_1.HttpException({
                error: 'Rate limit exceeded',
                limit: result.limit,
                retryAfterMs: result.retryAfterMs,
            }, 429);
        }
        return true;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        rate_limit_service_1.RateLimitService])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map