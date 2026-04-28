import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    /**
     * Execute a query within a tenant context.
     * Uses AsyncLocalStorage in production; here we use a global fallback for simplicity.
     */
    withTenant<T>(tenantId: string, fn: () => Promise<T>): Promise<T>;
}
//# sourceMappingURL=prisma.service.d.ts.map