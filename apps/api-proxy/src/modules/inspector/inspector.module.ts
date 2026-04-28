import { Module } from '@nestjs/common';
import { InspectorController } from './inspector.controller';
import { InspectorService } from './inspector.service';
import { InspectorEngine } from './inspector.engine';
import { SemanticAnalyzerService } from './semantic-analyzer.service';
import { ShieldModule } from '../shield/shield.module';
import { FingerprintModule } from '../fingerprint/fingerprint.module';
import { RemediationModule } from '../remediation/remediation.module';
import { MlModule } from '../ml/ml.module';
import { HoneypotModule } from '../honeypot/honeypot.module';
import { DlpModule } from '../dlp/dlp.module';
import { RateLimitModule } from '../rate-limit/rate-limit.module';
import { BillingModule } from '../billing/billing.module';
import { AlertsGateway } from '../websocket/alerts.gateway';

@Module({
  imports: [
    ShieldModule,
    FingerprintModule,
    RemediationModule,
    MlModule,
    HoneypotModule,
    DlpModule,
    RateLimitModule,
    BillingModule,
  ],
  controllers: [InspectorController],
  providers: [InspectorService, InspectorEngine, SemanticAnalyzerService, AlertsGateway],
  exports: [InspectorService, InspectorEngine],
})
export class InspectorModule {}
