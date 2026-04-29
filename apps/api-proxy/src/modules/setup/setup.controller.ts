import { Controller, Post, Headers, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Setup')
@Controller()
export class SetupController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('setup')
  async bootstrap(
    @Headers('x-setup-secret') secret: string,
    @Body() dto: { name: string; email?: string },
  ) {
    try {
      const setupSecret = process.env.SETUP_SECRET;
      const existing = await this.prisma.tenant.findFirst();

    // Se já existe tenant, exige secret correto
    if (existing) {
      if (!setupSecret || secret !== setupSecret) {
        throw new HttpException('Bootstrap not allowed: invalid secret', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Tenant already exists', HttpStatus.CONFLICT);
    }

    // Primeiro bootstrap: permite criar tenant sem secret (seguro pois db está vazio)

    const tenant = await this.prisma.tenant.create({
      data: {
        name: dto.name || 'Default Tenant',
        plan: 'ENTERPRISE',
        status: 'ACTIVE',
      },
    });

    const apiKeyRaw = `sentinel_sk_${Buffer.from(uuidv4()).toString('base64url')}`;
    await this.prisma.apiKey.create({
      data: {
        tenantId: tenant.id,
        keyHash: apiKeyRaw,
        scopes: ['read:threats', 'write:rules', 'admin'],
      },
    });

    return {
      tenantId: tenant.id,
      apiKey: apiKeyRaw,
      name: tenant.name,
      plan: tenant.plan,
      createdAt: tenant.createdAt,
    };
    } catch (err: any) {
      console.error('[Setup] Bootstrap failed:', err);
      return {
        statusCode: 500,
        message: 'Bootstrap failed',
        error: err?.message || String(err),
        code: err?.code,
        meta: err?.meta,
      };
    }
  }
}
