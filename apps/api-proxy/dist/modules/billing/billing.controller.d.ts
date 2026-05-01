import { PrismaService } from '../../prisma/prisma.service';
export declare class BillingController {
    private readonly prisma;
    private stripe;
    constructor(prisma: PrismaService);
    createCheckoutSession(apiKey: string, body: {
        plan: 'PRO' | 'ENTERPRISE';
    }): Promise<{
        url: any;
    }>;
    createPortalSession(apiKey: string): Promise<{
        url: any;
    }>;
}
//# sourceMappingURL=billing.controller.d.ts.map