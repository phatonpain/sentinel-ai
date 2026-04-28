import { Controller, Get, UseGuards, Version, Req } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiKeyGuard } from '../../common/api-key.guard';
import { TenantGuard } from '../../common/tenant.guard';
import { ImpersonationGuard } from '../../common/impersonation.guard';

@ApiTags('Metrics')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard, TenantGuard, ImpersonationGuard)
@Controller('metrics')
export class MetricsController {
  constructor(private readonly prisma: PrismaService) {}

  @Version('1')
  @Get()
  async getMetrics(@Req() req: Request) {
    const tenantId = req.headers['x-tenant-id'] as string;
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // For MVP use raw queries due to multiSchema limitations
    const totalRequests24h = await (this.prisma as any).requestLog.count({
      where: { timestamp: { gte: yesterday } },
    }).catch(() => 0);

    const threatsBlocked24h = await (this.prisma as any).requestLog.count({
      where: { timestamp: { gte: yesterday }, verdict: 'BLOCK' },
    }).catch(() => 0);

    const avgRiskScore = await (this.prisma as any).requestLog.aggregate({
      where: { timestamp: { gte: yesterday } },
      _avg: { riskScore: true },
    }).then((r: any) => Math.round(r._avg?.riskScore || 0)).catch(() => 0);

    const activeAlerts = await (this.prisma as any).threat.count({
      where: { resolvedAt: null },
    }).catch(() => 0);

    return {
      data: {
        totalRequests24h,
        threatsBlocked24h,
        avgRiskScore,
        activeAlerts,
        tenantId,
      },
    };
  }
}
