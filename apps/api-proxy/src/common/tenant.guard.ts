import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'] as string | undefined;
    const apiKey = request.headers['x-sentinel-api-key'] as string | undefined;

    if (!tenantId) {
      throw new UnauthorizedException('Missing X-Tenant-Id header');
    }

    if (!apiKey) {
      throw new UnauthorizedException('Missing X-Sentinel-Api-Key header');
    }

    // Verify that the API key belongs to the claimed tenant
    const keyRecord = await this.prisma.apiKey.findFirst({
      where: {
        tenantId,
        revokedAt: null,
      },
    });

    if (!keyRecord) {
      throw new ForbiddenException('Invalid tenant or API key');
    }

    // MVP: plain text compare. Production: bcrypt.compare(apiKey, keyRecord.keyHash)
    if (apiKey === keyRecord.keyHash) {
      request.tenantId = tenantId;
      return true;
    }

    // Dev bypass: accept the env key as a fallback
    const envKey = process.env.SENTINEL_API_KEY;
    if (envKey && apiKey === envKey) {
      request.tenantId = tenantId;
      return true;
    }

    throw new ForbiddenException('API key does not match tenant');
  }
}
