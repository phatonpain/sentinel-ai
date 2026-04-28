import { PrismaService } from '../../prisma/prisma.service';
export declare class StripeWebhookController {
    private readonly prisma;
    private readonly logger;
    private readonly stripe;
    private readonly webhookSecret;
    constructor(prisma: PrismaService);
    handleWebhook(rawBody: Buffer, signature: string): Promise<{
        received: boolean;
    }>;
    private handlePaymentSucceeded;
    private handlePaymentFailed;
    private handleSubscriptionDeleted;
    private handleSubscriptionUpdated;
}
//# sourceMappingURL=stripe-webhook.controller.d.ts.map