"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InspectorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectorService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const inspector_engine_1 = require("./inspector.engine");
const remediation_service_1 = require("../remediation/remediation.service");
const billing_service_1 = require("../billing/billing.service");
const alerts_gateway_1 = require("../websocket/alerts.gateway");
let InspectorService = InspectorService_1 = class InspectorService {
    engine;
    remediationService;
    billingService;
    alertsGateway;
    logger = new common_1.Logger(InspectorService_1.name);
    constructor(engine, remediationService, billingService, alertsGateway) {
        this.engine = engine;
        this.remediationService = remediationService;
        this.billingService = billingService;
        this.alertsGateway = alertsGateway;
    }
    async inspect(dto) {
        const context = {
            ...dto.context,
            requestId: dto.context.requestId || (0, uuid_1.v4)(),
        };
        // Quota guard
        if (context.tenantId) {
            const quota = await this.billingService.checkQuota(context.tenantId);
            if (!quota.allowed) {
                this.logger.warn({ msg: 'Quota exceeded', tenantId: context.tenantId, usage: quota.usage, limit: quota.limit });
                return {
                    decision: {
                        verdict: 'BLOCK',
                        riskScore: 100,
                        incidentId: (0, uuid_1.v4)(),
                        threatType: 'RATE_LIMIT_VIOLATION',
                        confidence: 1,
                        reasons: ['[QUOTA] Monthly request quota exceeded. Upgrade your plan.'],
                        latencyMs: 0,
                    },
                    forensics: {
                        headersSnapshot: this.sanitizeHeaders(context.headers),
                        bodyTruncated: this.truncateBody(context.body),
                        timing: { parseMs: 0, heuristicMs: 0, fingerprintMs: 0, mlMs: 0, llmMs: 0, dlpMs: 0, honeypotMs: 0, rateLimitMs: 0, totalMs: 0 },
                    },
                };
            }
            await this.billingService.incrementUsage(context.tenantId);
        }
        const result = await this.engine.inspect(context);
        // Real-time alert broadcast
        if (result.verdict !== 'ALLOW' && context.tenantId) {
            const alert = {
                type: result.verdict,
                severity: result.finalScore >= 85 ? 'CRITICAL' : result.finalScore >= 70 ? 'HIGH' : 'MEDIUM',
                incidentId: result.incidentId || 'unknown',
                threatType: result.reasons.find((r) => r.threatType)?.threatType || 'UNKNOWN',
                sourceIp: context.sourceIp,
                path: context.path,
                timestamp: new Date().toISOString(),
                message: `${result.reasons[0]?.threatType || 'Threat'} detected from ${context.sourceIp}`,
                tenantId: context.tenantId,
            };
            this.alertsGateway.broadcastAlert(context.tenantId, alert);
        }
        // Auto-remediation for BLOCK/CHALLENGE
        if ((dto.options?.autoRemediate ?? true) && result.verdict !== 'ALLOW') {
            const decision = {
                verdict: result.verdict,
                riskScore: result.finalScore,
                incidentId: result.incidentId,
                threatType: result.reasons.find((r) => r.threatType)?.threatType,
                confidence: result.confidence,
                reasons: result.reasons.map((r) => `[${r.layer}] ${r.explanation}`),
                latencyMs: result.latencyBreakdown.totalMs,
            };
            await this.remediationService.execute(context, decision).catch((err) => {
                this.logger.error({ msg: 'Remediation failed', err, incidentId: result.incidentId });
            });
        }
        this.logger.log({
            requestId: context.requestId,
            verdict: result.verdict,
            riskScore: result.finalScore,
            incidentId: result.incidentId,
            path: context.path,
            ip: this.maskIp(context.sourceIp),
            latencyMs: result.latencyBreakdown.totalMs,
            costUsd: result.costBreakdown.llmCostUsd,
        });
        return {
            decision: {
                verdict: result.verdict,
                riskScore: result.finalScore,
                incidentId: result.incidentId,
                threatType: result.reasons.find((r) => r.threatType)?.threatType,
                confidence: result.confidence,
                reasons: result.reasons.map((r) => `[${r.layer}] ${r.explanation}`),
                latencyMs: result.latencyBreakdown.totalMs,
            },
            forensics: {
                headersSnapshot: this.sanitizeHeaders(context.headers),
                bodyTruncated: this.truncateBody(context.body),
                timing: {
                    ...result.latencyBreakdown,
                    parseMs: 0.02,
                },
                dlp: result.dlp ? {
                    score: result.dlp.score,
                    matches: result.dlp.matches,
                    redactedPayload: result.dlp.redactedPayload,
                } : undefined,
                rateLimit: result.rateLimit ? {
                    allowed: result.rateLimit.allowed,
                    remaining: result.rateLimit.remaining,
                    resetAt: result.rateLimit.resetAt,
                    limit: result.rateLimit.limit,
                    windowMs: result.rateLimit.windowMs,
                    retryAfterMs: result.rateLimit.retryAfterMs,
                    burstDetected: result.rateLimit.burstDetected,
                } : undefined,
            },
        };
    }
    maskIp(ip) {
        if (!ip || ip === 'unknown')
            return ip;
        const parts = ip.split('.');
        if (parts.length === 4) {
            return `${parts[0]}.${parts[1]}.*.*`;
        }
        return ip.substring(0, Math.min(ip.length, 8)) + '...';
    }
    sanitizeHeaders(headers) {
        const sensitive = ['authorization', 'cookie', 'x-api-key', 'x-sentinel-api-key'];
        const out = {};
        for (const [k, v] of Object.entries(headers)) {
            out[k] = sensitive.includes(k.toLowerCase()) ? '[REDACTED]' : v;
        }
        return out;
    }
    truncateBody(body) {
        if (body === undefined || body === null)
            return undefined;
        const str = typeof body === 'string' ? body : JSON.stringify(body);
        if (str.length <= 1024)
            return str;
        return str.substring(0, 1024) + '...[truncated]';
    }
};
exports.InspectorService = InspectorService;
exports.InspectorService = InspectorService = InspectorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [inspector_engine_1.InspectorEngine,
        remediation_service_1.RemediationService,
        billing_service_1.BillingService,
        alerts_gateway_1.AlertsGateway])
], InspectorService);
//# sourceMappingURL=inspector.service.js.map