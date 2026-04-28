import { Controller, Get, Param, Query, UseGuards, Version, Req } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiKeyGuard } from '../../common/api-key.guard';
import { TenantGuard } from '../../common/tenant.guard';
import { ImpersonationGuard } from '../../common/impersonation.guard';

@ApiTags('Threats')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard, TenantGuard, ImpersonationGuard)
@Controller('threats')
export class ThreatsController {
  constructor(private readonly prisma: PrismaService) {}

  @Version('1')
  @Get()
  async listThreats(
    @Req() req: Request,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('severity') severity?: string,
  ) {
    const tenantId = req.headers['x-tenant-id'] as string;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

    // Isolation enforced by TenantGuard, but we also enforce it in query
    // NOTE: Prisma multiSchema requires schema switching; for MVP we simulate with tenantId field
    const where: any = { tenantId };
    if (severity) where.severity = severity;

    const threats = await this.prisma.$transaction(async (tx: any) => {
      const data = await (tx as any).threat.findMany({
        where,
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      });
      const total = await (tx as any).threat.count({ where });
      return { data, total };
    });

    return {
      data: threats.data,
      meta: {
        page: pageNum,
        limit: limitNum,
        total: threats.total,
        totalPages: Math.ceil(threats.total / limitNum),
      },
    };
  }

  @Version('1')
  @Get(':id')
  async getThreat(@Req() req: Request, @Param('id') id: string) {
    const tenantId = req.headers['x-tenant-id'] as string;

    const threat = await (this.prisma as any).threat.findFirst({
      where: { id, tenantId },
    });

    if (!threat) {
      return { statusCode: 404, message: 'Threat not found' };
    }

    return threat;
  }
}
