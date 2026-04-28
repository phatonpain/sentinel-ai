import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { BillingService } from '../modules/billing/billing.service';

@Injectable()
export class QuotaGuard implements CanActivate {
  constructor(private readonly billingService: BillingService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.tenantId;

    if (!tenantId) {
      return true; // Allow if no tenant (should not happen with TenantGuard)
    }

    const quota = await this.billingService.checkQuota(tenantId);
    if (!quota.allowed) {
      throw new ForbiddenException({
        code: 'QUOTA_EXCEEDED',
        message: `Monthly request quota exceeded (${quota.limit}). Upgrade your plan.`,
        currentUsage: quota.usage,
        limit: quota.limit,
        upgradeUrl: '/dashboard/billing',
      });
    }

    return true;
  }
}
