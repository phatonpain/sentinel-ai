import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-sentinel-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('Missing X-Sentinel-Api-Key header');
    }

    // Dev bypass
    const expectedKey = process.env.SENTINEL_API_KEY;
    if (expectedKey && apiKey === expectedKey) {
      return true;
    }

    // Validate against database (plain text for MVP; use bcrypt in production)
    const keyRecord = await this.prisma.apiKey.findFirst({
      where: {
        keyHash: apiKey,
        revokedAt: null,
      },
    });

    if (!keyRecord) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Attach tenantId to request for downstream guards
    request.tenantId = keyRecord.tenantId;
    return true;
  }
}
