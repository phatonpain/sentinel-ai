import { CanActivate, ExecutionContext, Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RateLimitService } from '../modules/rate-limit/rate-limit.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rateLimitService: RateLimitService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    const result = await this.rateLimitService.check(
      {
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
      },
      {
        windowMs: 60_000,
        maxRequests: limit,
        burstMax: Math.ceil(limit / 5),
        blockDurationMs: 60_000,
      },
    );

    // Attach rate limit headers to response
    const response = context.switchToHttp().getResponse();
    response.setHeader('X-RateLimit-Limit', result.limit);
    response.setHeader('X-RateLimit-Remaining', result.remaining);
    response.setHeader('X-RateLimit-Reset', Math.ceil(result.resetAt / 1000));

    if (!result.allowed) {
      throw new HttpException(
        {
          error: 'Rate limit exceeded',
          limit: result.limit,
          retryAfterMs: result.retryAfterMs,
        },
        429,
      );
    }

    return true;
  }
}
