import { Module } from '@nestjs/common';
import { HoneypotService } from './honeypot.service';

@Module({
  providers: [HoneypotService],
  exports: [HoneypotService],
})
export class HoneypotModule {}
