import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

@Controller('v1/e2e')
export class E2EController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  private guard(): void {
    if (process.env.NODE_ENV !== 'test' && process.env.ENABLE_E2E !== 'true') {
      throw new NotFoundException();
    }
  }

  @Post('setup-user')
  async setupUser(
    @Body() body: { email: string; tenantName: string; plan?: string },
  ) {
    this.guard();

    // 1. Create tenant directly
    const tenant = await this.prisma.tenant.create({
      data: {
        name: body.tenantName,
        plan: (body.plan as any) || 'FREE',
        status: 'ACTIVE',
      },
    });

    // 2. Create API key (plain text for test only)
    const plainKey = `sk_e2e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await this.prisma.apiKey.create({
      data: {
        tenantId: tenant.id,
        keyHash: plainKey,
        scopes: ['read', 'write'],
      },
    });

    // 3. Generate JWT
    const token = await this.authService.createToken({
      userId: `e2e-user-${Date.now()}`,
      tenantId: tenant.id,
      email: body.email,
      role: 'admin',
    });

    return {
      userId: `e2e-user-${Date.now()}`,
      tenantId: tenant.id,
      apiKey: plainKey,
      token,
      email: body.email,
      password: 'TestPassword123!',
    };
  }

  @Post('cleanup')
  async cleanup(@Body() body: { tenantId: string }) {
    this.guard();

    // Delete API keys first
    await this.prisma.apiKey.deleteMany({ where: { tenantId: body.tenantId } });
    // Delete tenant
    await this.prisma.tenant.delete({ where: { id: body.tenantId } }).catch(() => null);

    return { cleaned: true };
  }
}
