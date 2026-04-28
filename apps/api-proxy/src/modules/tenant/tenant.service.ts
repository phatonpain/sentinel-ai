import { Injectable, Logger } from '@nestjs/common';
import type { Tenant } from '@sentinel/shared-types';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);
  // private tenants = new Map<string, Tenant>();

  async resolveByApiKey(apiKey: string): Promise<Tenant | null> {
    // TODO: query Prisma with key hash
    this.logger.debug(`Resolving tenant for key ${apiKey.substring(0, 8)}...`);
    return null;
  }

  async getSchemaName(tenantId: string): Promise<string> {
    return `tenant_${tenantId.replace(/-/g, '_')}`;
  }
}
