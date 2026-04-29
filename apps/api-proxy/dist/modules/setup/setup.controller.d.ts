import { PrismaService } from '../../prisma/prisma.service';
export declare class SetupController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    bootstrap(secret: string, dto: {
        name: string;
        email?: string;
    }): Promise<{
        tenantId: string;
        apiKey: string;
        name: string;
        plan: import("@prisma/client").$Enums.PlanType;
        createdAt: Date;
    }>;
}
//# sourceMappingURL=setup.controller.d.ts.map