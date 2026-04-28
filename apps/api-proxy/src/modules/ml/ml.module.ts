import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MlServiceClient } from './ml.service';

@Module({
  imports: [ConfigModule],
  providers: [MlServiceClient],
  exports: [MlServiceClient],
})
export class MlModule {}
