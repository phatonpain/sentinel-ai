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
            name: string;
            plan: import("@prisma/client").$Enums.PlanType;
            status: import("@prisma/client").$Enums.TenantStatus;
            createdAt: Date;
        }[];
    }>;
    createApiKey(tenantId: string): Promise<{
        tenantId: string;
        apiKey: string;
        scopes: string[];
    }>;
}
//# sourceMappingURL=admin.controller.d.ts.map