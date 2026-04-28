import { CanActivate, ExecutionContext } from '@nestjs/common';
import { BillingService } from '../modules/billing/billing.service';
export declare class QuotaGuard implements CanActivate {
    private readonly billingService;
    constructor(billingService: BillingService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
//# sourceMappingURL=quota.guard.d.ts.map