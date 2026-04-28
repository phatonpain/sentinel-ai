import { Controller, Get, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiKeyGuard } from '../../common/api-key.guard';
import { TenantGuard } from '../../common/tenant.guard';
import { ImpersonationGuard } from '../../common/impersonation.guard';

@ApiTags('Fingerprints')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard, TenantGuard, ImpersonationGuard)
@Controller('fingerprints')
export class FingerprintController {
  constructor(private readonly prisma: PrismaService) {}

  @Version('1')
  @Get()
  async listFingerprints() {
    // For MVP, return from tenant schema (raw query due to multiSchema)
    const fingerprints = await (this.prisma as any).fingerprint.findMany({
      orderBy: { lastSeen: 'desc' },
      take: 100,
    });

    return {
      data: fingerprints.map((fp: any) => ({
        identityId: fp.identityId,
        anomalyScore: Math.round(fp.anomalyScore * 100),
        lastSeen: fp.lastSeen,
        tags: fp.baseline?.tags || ['behavioral'],
      })),
      meta: { total: fingerprints.length },
    };
  }
}
