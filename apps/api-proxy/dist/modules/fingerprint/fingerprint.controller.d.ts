import { PrismaService } from '../../prisma/prisma.service';
export declare class FingerprintController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listFingerprints(): Promise<{
        data: any;
        meta: {
            total: any;
        };
    }>;
}
//# sourceMappingURL=fingerprint.controller.d.ts.map