export type PlanType = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
export type TenantStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';
export interface Tenant {
    id: string;
    name: string;
    plan: PlanType;
    status: TenantStatus;
    createdAt: string;
}
export interface ApiKey {
    id: string;
    tenantId: string;
    keyHash: string;
    scopes: string[];
    lastUsed?: string;
    revokedAt?: string;
}
export interface QuotaLimits {
    inspectsPerMonth: number;
    honeypots: number;
    retentionDays: number;
    dlpEnabled: boolean;
    graphqlArmorEnabled: boolean;
    complianceEnabled: boolean;
    redTeamEnabled: boolean;
}
export declare const PLAN_LIMITS: Record<PlanType, QuotaLimits>;
//# sourceMappingURL=tenant.d.ts.map