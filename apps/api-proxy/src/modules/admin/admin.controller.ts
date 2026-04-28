import { Controller, Post, Get, Body, Param, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiKeyGuard } from '../../common/api-key.guard';
import { ImpersonationGuard } from '../../common/impersonation.guard';
import { v4 as uuidv4 } from 'uuid';

@ApiTags('Admin')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard, ImpersonationGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Version('1')
  @Post('tenants')
  async createTenant(@Body() body: { name: string; plan?: string }) {
    const tenant = await this.prisma.tenant.create({
      data: {
        name: body.name,
        plan: (body.plan as any) || 'FREE',
      },
    });
    return { tenantId: tenant.id, name: tenant.name, plan: tenant.plan };
  }

  @Version('1')
  @Get('tenants')
  async listTenants() {
    const tenants = await this.prisma.tenant.findMany({
      select: { id: true, name: true, plan: true, status: true, createdAt: true },
    });
    return { tenants };
  }

  @Version('1')
  @Post('tenants/:tenantId/api-keys')
  async createApiKey(@Param('tenantId') tenantId: string) {
    const key = uuidv4();
    // In production: hash with bcrypt before storing
    await this.prisma.apiKey.create({
      data: {
        tenantId,
        keyHash: key, // TODO: bcrypt
        scopes: ['read:threats', 'write:rules'],
      },
    });
    return { tenantId, apiKey: key, scopes: ['read:threats', 'write:rules'] };
  }
}
