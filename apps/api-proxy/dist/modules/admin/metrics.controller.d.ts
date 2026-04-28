import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
export declare class MetricsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMetrics(req: Request): Promise<{
        data: {
            totalRequests24h: any;
            threatsBlocked24h: any;
            avgRiskScore: any;
            activeAlerts: any;
            tenantId: string;
        };
    }>;
}
//# sourceMappingURL=metrics.controller.d.ts.map