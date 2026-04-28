import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    health(): Promise<{
        status: string;
        timestamp: string;
        services: {
            database: string;
            redis: string;
        };
        version: string;
    }>;
}
//# sourceMappingURL=app.controller.d.ts.map