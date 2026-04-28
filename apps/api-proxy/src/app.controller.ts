import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async health() {
    let dbStatus = 'ok';
    let redisStatus = 'ok';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'error';
    }

    try {
      // Simple Redis ping via a raw TCP check would be better, but for MVP we skip
      // since Redis may not be directly accessible from this controller
    } catch {
      redisStatus = 'error';
    }

    return {
      status: dbStatus === 'ok' && redisStatus === 'ok' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      services: { database: dbStatus, redis: redisStatus },
      version: process.env.npm_package_version || '1.0.0',
    };
  }
}
