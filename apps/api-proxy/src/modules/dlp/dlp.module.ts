import { Module } from '@nestjs/common';
import { DlpService } from './dlp.service';

@Module({
  providers: [DlpService],
  exports: [DlpService],
})
export class DlpModule {}
