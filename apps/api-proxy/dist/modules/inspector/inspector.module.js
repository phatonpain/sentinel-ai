"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectorModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const inspector_controller_1 = require("./inspector.controller");
const inspector_service_1 = require("./inspector.service");
const inspector_engine_1 = require("./inspector.engine");
const semantic_analyzer_service_1 = require("./semantic-analyzer.service");
const shield_module_1 = require("../shield/shield.module");
const fingerprint_module_1 = require("../fingerprint/fingerprint.module");
const remediation_module_1 = require("../remediation/remediation.module");
const ml_module_1 = require("../ml/ml.module");
const honeypot_module_1 = require("../honeypot/honeypot.module");
const dlp_module_1 = require("../dlp/dlp.module");
const rate_limit_module_1 = require("../rate-limit/rate-limit.module");
const billing_module_1 = require("../billing/billing.module");
const alerts_gateway_1 = require("../websocket/alerts.gateway");
let InspectorModule = class InspectorModule {
};
exports.InspectorModule = InspectorModule;
exports.InspectorModule = InspectorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            shield_module_1.ShieldModule,
            fingerprint_module_1.FingerprintModule,
            remediation_module_1.RemediationModule,
            ml_module_1.MlModule,
            honeypot_module_1.HoneypotModule,
            dlp_module_1.DlpModule,
            rate_limit_module_1.RateLimitModule,
            billing_module_1.BillingModule,
        ],
        controllers: [inspector_controller_1.InspectorController],
        providers: [inspector_service_1.InspectorService, inspector_engine_1.InspectorEngine, semantic_analyzer_service_1.SemanticAnalyzerService, alerts_gateway_1.AlertsGateway],
        exports: [inspector_service_1.InspectorService, inspector_engine_1.InspectorEngine],
    })
], InspectorModule);
//# sourceMappingURL=inspector.module.js.map