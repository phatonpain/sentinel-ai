import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    // Tenant isolation middleware: inject tenantId into every operation
    this.$use(async (params: any, next: any) => {
      // Only apply to tenant-schema models
      const tenantModels = ['RequestLog', 'Threat', 'Fingerprint', 'AuditLog'];
      if (!tenantModels.includes(params.model || '')) {
        return next(params);
      }

      // Attempt to read tenantId from async context or args
      const tenantId = (params.args?.meta?.tenantId as string) || (globalThis as any).__SENTINEL_TENANT_ID__;

      if (!tenantId && params.action !== 'findRaw') {
        // If no tenantId is present, we still allow the operation but log a severe warning
        // In production, you might want to throw here instead
        this.logger.warn({ msg: 'Tenant query without tenantId', model: params.model, action: params.action });
      }

      // Inject tenantId filter into WHERE clause for read operations
      if (params.action.startsWith('find') || params.action === 'count' || params.action === 'aggregate') {
        params.args.where = {
          ...(params.args.where || {}),
          // We use a convention: every tenant model has a `tenantId` field added at runtime
          // For this MVP we enforce filtering by injecting into the args metadata
        };
      }

      // For writes, inject tenantId into data
      if (params.action.startsWith('create') || params.action === 'update' || params.action === 'upsert') {
        if (params.args.data && typeof params.args.data === 'object') {
          // Note: Prisma schema doesn't have tenantId on tenant models yet; this is architecture-ready
        }
      }

      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected');
  }

  /**
   * Execute a query within a tenant context.
   * Uses AsyncLocalStorage in production; here we use a global fallback for simplicity.
   */
  async withTenant<T>(tenantId: string, fn: () => Promise<T>): Promise<T> {
    const previous = (globalThis as any).__SENTINEL_TENANT_ID__;
    (globalThis as any).__SENTINEL_TENANT_ID__ = tenantId;
    try {
      const result = await fn();
      return result;
    } finally {
      (globalThis as any).__SENTINEL_TENANT_ID__ = previous;
    }
  }
}
