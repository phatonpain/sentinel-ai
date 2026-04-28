import { Module } from '@nestjs/common';
import { FingerprintService } from './fingerprint.service';
import { FingerprintController } from './fingerprint.controller';

@Module({
  providers: [FingerprintService],
  exports: [FingerprintService],
  controllers: [FingerprintController],
})
export class FingerprintModule {}
