"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const inspector_module_1 = require("./modules/inspector/inspector.module");
const shield_module_1 = require("./modules/shield/shield.module");
const auth_module_1 = require("./modules/auth/auth.module");
const tenant_module_1 = require("./modules/tenant/tenant.module");
const fingerprint_module_1 = require("./modules/fingerprint/fingerprint.module");
const honeypot_module_1 = require("./modules/honeypot/honeypot.module");
const remediation_module_1 = require("./modules/remediation/remediation.module");
const threat_intel_module_1 = require("./modules/threat-intel/threat-intel.module");
const compliance_module_1 = require("./modules/compliance/compliance.module");
const billing_module_1 = require("./modules/billing/billing.module");
const admin_module_1 = require("./modules/admin/admin.module");
const e2e_module_1 = require("./modules/e2e/e2e.module");
const dlp_module_1 = require("./modules/dlp/dlp.module");
const rate_limit_module_1 = require("./modules/rate-limit/rate-limit.module");
const threats_module_1 = require("./modules/threats/threats.module");
const ml_module_1 = require("./modules/ml/ml.module");
const feedback_module_1 = require("./modules/feedback/feedback.module");
const alerts_gateway_1 = require("./modules/websocket/alerts.gateway");
const app_controller_1 = require("./app.controller");
const app_config_1 = require("./config/app.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.appConfig],
            }),
            prisma_module_1.PrismaModule,
            inspector_module_1.InspectorModule,
            shield_module_1.ShieldModule,
            auth_module_1.AuthModule,
            tenant_module_1.TenantModule,
            fingerprint_module_1.FingerprintModule,
            honeypot_module_1.HoneypotModule,
            remediation_module_1.RemediationModule,
            threat_intel_module_1.ThreatIntelModule,
            compliance_module_1.ComplianceModule,
            billing_module_1.BillingModule,
            admin_module_1.AdminModule,
            e2e_module_1.E2EModule,
            threats_module_1.ThreatsModule,
            ml_module_1.MlModule,
            feedback_module_1.FeedbackModule,
            dlp_module_1.DlpModule,
            rate_limit_module_1.RateLimitModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [alerts_gateway_1.AlertsGateway],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map