import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RateLimitService } from '../modules/rate-limit/rate-limit.service';
export declare class RateLimitGuard implements CanActivate {
    private readonly prisma;
    private readonly rateLimitService;
    constructor(prisma: PrismaService, rateLimitService: RateLimitService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
//# sourceMappingURL=rate-limit.guard.d.ts.map