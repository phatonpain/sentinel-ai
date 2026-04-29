import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SetupModule } from './modules/setup/setup.module';
import { InspectorModule } from './modules/inspector/inspector.module';
import { ShieldModule } from './modules/shield/shield.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { FingerprintModule } from './modules/fingerprint/fingerprint.module';
import { HoneypotModule } from './modules/honeypot/honeypot.module';
import { RemediationModule } from './modules/remediation/remediation.module';
import { ThreatIntelModule } from './modules/threat-intel/threat-intel.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { BillingModule } from './modules/billing/billing.module';
import { AdminModule } from './modules/admin/admin.module';
import { E2EModule } from './modules/e2e/e2e.module';
import { DlpModule } from './modules/dlp/dlp.module';
import { RateLimitModule } from './modules/rate-limit/rate-limit.module';
import { ThreatsModule } from './modules/threats/threats.module';
import { MlModule } from './modules/ml/ml.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { AlertsGateway } from './modules/websocket/alerts.gateway';
import { AppController } from './app.controller';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    PrismaModule,
    SetupModule,
    InspectorModule,
    ShieldModule,
    AuthModule,
    TenantModule,
    FingerprintModule,
    HoneypotModule,
    RemediationModule,
    ThreatIntelModule,
    ComplianceModule,
    BillingModule,
    AdminModule,
    E2EModule,
    ThreatsModule,
    MlModule,
    FeedbackModule,
    DlpModule,
    RateLimitModule,
  ],
  controllers: [AppController],
  providers: [AlertsGateway],
})
export class AppModule {}
