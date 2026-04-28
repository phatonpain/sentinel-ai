import type { Tenant } from '@sentinel/shared-types';
export declare class TenantService {
    private readonly logger;
    resolveByApiKey(apiKey: string): Promise<Tenant | null>;
    getSchemaName(tenantId: string): Promise<string>;
}
//# sourceMappingURL=tenant.service.d.ts.map