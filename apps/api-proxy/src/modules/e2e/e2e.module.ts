import { Module } from '@nestjs/common';
import { E2EController } from './e2e.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [E2EController],
})
export class E2EModule {}
