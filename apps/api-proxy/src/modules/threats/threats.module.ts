import { Module } from '@nestjs/common';
import { ThreatsController } from './threats.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ThreatsController],
})
export class ThreatsModule {}
