import { PrismaService } from '../../prisma/prisma.service';
export declare class SetupController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    bootstrap(secret: string, dto: {
        name: string;
        email?: string;
    }): Promise<{
        tenantId: string;
        apiKey: string | null;
        name: string;
        plan: import("@prisma/client").$Enums.PlanType;
        createdAt: Date;
        recovered: boolean;
        statusCode?: undefined;
        message?: undefined;
        error?: undefined;
        code?: undefined;
        meta?: undefined;
    } | {
        tenantId: string;
        apiKey: string;
        name: string;
        plan: import("@prisma/client").$Enums.PlanType;
        createdAt: Date;
        recovered?: undefined;
        statusCode?: undefined;
        message?: undefined;
        error?: undefined;
        code?: undefined;
        meta?: undefined;
    } | {
        statusCode: number;
        message: string;
        error: any;
        code: any;
        meta: any;
        tenantId?: undefined;
        apiKey?: undefined;
        name?: undefined;
        plan?: undefined;
        createdAt?: undefined;
        recovered?: undefined;
    }>;
}
//# sourceMappingURL=setup.controller.d.ts.map