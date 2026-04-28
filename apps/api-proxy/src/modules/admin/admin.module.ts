import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { MetricsController } from './metrics.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController, MetricsController],
})
export class AdminModule {}
