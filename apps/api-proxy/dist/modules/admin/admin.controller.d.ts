import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createTenant(body: {
        name: string;
        plan?: string;
    }): Promise<{
        tenantId: string;
        name: string;
        plan: import("@prisma/client").$Enums.PlanType;
    }>;
    listTenants(): Promise<{
        tenants: {
            id: string;
            createdAt: Date;
            name: string;
            status: import("@prisma/client").$Enums.TenantStatus;
            plan: import("@prisma/client").$Enums.PlanType;
        }[];
    }>;
    createApiKey(tenantId: string): Promise<{
        tenantId: string;
        apiKey: string;
        scopes: string[];
    }>;
}
//# sourceMappingURL=admin.controller.d.ts.map