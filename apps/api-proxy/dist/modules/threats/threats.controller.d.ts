import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
export declare class ThreatsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listThreats(req: Request, page?: string, limit?: string, severity?: string): Promise<{
        data: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getThreat(req: Request, id: string): Promise<any>;
}
//# sourceMappingURL=threats.controller.d.ts.map