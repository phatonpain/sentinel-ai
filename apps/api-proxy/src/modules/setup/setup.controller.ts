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
    const setupSecret = process.env.SETUP_SECRET;
    const existing = await this.prisma.tenant.findFirst();

    // Se já existe tenant, exige secret
    if (existing) {
      if (!setupSecret || secret !== setupSecret) {
        throw new HttpException('Invalid setup secret', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Tenant already exists', HttpStatus.CONFLICT);
    }

    // Se não existe tenant ainda e não há SETUP_SECRET, permite bootstrap inicial
    if (setupSecret && secret !== setupSecret) {
      throw new HttpException('Invalid setup secret', HttpStatus.FORBIDDEN);
    }

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
  }
}
