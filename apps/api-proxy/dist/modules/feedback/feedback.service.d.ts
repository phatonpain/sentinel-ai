import { PrismaService } from '../../prisma/prisma.service';
export interface FeedbackDto {
    isFalsePositive: boolean;
    notes?: string;
    correctedVerdict?: 'ALLOW' | 'BLOCK';
}
export declare class FeedbackService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    submitFeedback(tenantId: string, incidentId: string, dto: FeedbackDto): Promise<{
        status: string;
        action: string;
    }>;
}
//# sourceMappingURL=feedback.service.d.ts.map