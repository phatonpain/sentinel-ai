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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RemediationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemediationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let RemediationService = RemediationService_1 = class RemediationService {
    config;
    logger = new common_1.Logger(RemediationService_1.name);
    redis;
    slackWebhook;
    pagerdutyKey;
    constructor(config) {
        this.config = config;
        const redisUrl = this.config.get('redisUrl') || 'redis://localhost:6379';
        this.redis = new ioredis_1.default(redisUrl);
        this.slackWebhook = this.config.get('SLACK_WEBHOOK_URL') || undefined;
        this.pagerdutyKey = this.config.get('PAGERDUTY_INTEGRATION_KEY') || undefined;
    }
    async execute(ctx, decision) {
        const actions = [
            { type: 'LOG', target: ctx.requestId, metadata: { riskScore: decision.riskScore, threatType: decision.threatType } },
        ];
        // 1. BLOCK — always add IP to temporary ban list
        if (decision.verdict === 'BLOCK') {
            actions.push({ type: 'BLOCK', target: ctx.sourceIp });
            await this.banIp(ctx, decision);
        }
        // 2. CHALLENGE — CAPTCHA or MFA step-up
        if (decision.verdict === 'CHALLENGE') {
            actions.push({ type: 'INVALIDATE_TOKEN', target: ctx.apiKey || 'session' });
        }
        // 3. Secret rotation for high-confidence credential exfiltration
        if (decision.threatType === 'DLP_EXFILTRATION' && decision.riskScore >= 80) {
            actions.push({ type: 'ROTATE_SECRET', target: ctx.apiKey || 'tenant-master-key' });
        }
        // 4. Honeypot trigger → instant escalation
        if (decision.threatType === 'HONEYPOT_TRIGGER') {
            actions.push({ type: 'ALERT', target: 'security-team', metadata: { incidentId: decision.incidentId, priority: 'P1' } });
            await this.sendPagerDuty(ctx, decision, 'critical');
        }
        // 5. High severity alerts
        if (decision.riskScore >= 90 || decision.threatType === 'COMMAND_INJECTION' || decision.threatType === 'SSRF') {
            actions.push({ type: 'ALERT', target: 'security-team', metadata: { incidentId: decision.incidentId, priority: 'P1' } });
            await this.sendSlack(ctx, decision);
            await this.sendPagerDuty(ctx, decision, 'critical');
        }
        else if (decision.riskScore >= 70) {
            actions.push({ type: 'ALERT', target: 'security-team', metadata: { incidentId: decision.incidentId, priority: 'P2' } });
            await this.sendSlack(ctx, decision);
        }
        this.logger.warn({
            msg: 'Remediation executed',
            incidentId: decision.incidentId,
            requestId: ctx.requestId,
            tenantId: ctx.tenantId,
            actions: actions.map((a) => a.type),
        });
        return actions;
    }
    async banIp(ctx, decision) {
        const tenantId = ctx.tenantId || 'default';
        const key = `sentinel:ban:${tenantId}:${ctx.sourceIp}`;
        const duration = decision.riskScore >= 90 ? 3600 : 300; // 1h for critical, 5min for block
        try {
            await this.redis.setex(key, duration, JSON.stringify({
                incidentId: decision.incidentId,
                threatType: decision.threatType,
                riskScore: decision.riskScore,
                bannedAt: new Date().toISOString(),
            }));
        }
        catch {
            // Ignore Redis errors
        }
    }
    async sendSlack(ctx, decision) {
        if (!this.slackWebhook)
            return;
        try {
            const payload = {
                text: `🚨 Sentinel Alert — ${decision.threatType || 'Unknown Threat'}`,
                blocks: [
                    { type: 'header', text: { type: 'plain_text', text: 'Sentinel Security Alert' } },
                    {
                        type: 'section',
                        fields: [
                            { type: 'mrkdwn', text: `*Incident:*\n${decision.incidentId}` },
                            { type: 'mrkdwn', text: `*Threat:*\n${decision.threatType || 'N/A'}` },
                            { type: 'mrkdwn', text: `*Risk Score:*\n${decision.riskScore}` },
                            { type: 'mrkdwn', text: `*IP:*\n${ctx.sourceIp}` },
                            { type: 'mrkdwn', text: `*Path:*\n${ctx.method} ${ctx.path}` },
                            { type: 'mrkdwn', text: `*Tenant:*\n${ctx.tenantId || 'default'}` },
                        ],
                    },
                ],
            };
            await fetch(this.slackWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        }
        catch (err) {
            this.logger.error({ msg: 'Slack notification failed', err: err.message });
        }
    }
    async sendPagerDuty(ctx, decision, severity) {
        if (!this.pagerdutyKey)
            return;
        try {
            await fetch('https://events.pagerduty.com/v2/enqueue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    routing_key: this.pagerdutyKey,
                    event_action: 'trigger',
                    payload: {
                        summary: `Sentinel: ${decision.threatType || 'Threat'} detected on ${ctx.path}`,
                        severity,
                        source: ctx.sourceIp,
                        custom_details: {
                            incidentId: decision.incidentId,
                            riskScore: decision.riskScore,
                            tenantId: ctx.tenantId,
                            userAgent: ctx.userAgent,
                        },
                    },
                }),
            });
        }
        catch (err) {
            this.logger.error({ msg: 'PagerDuty notification failed', err: err.message });
        }
    }
};
exports.RemediationService = RemediationService;
exports.RemediationService = RemediationService = RemediationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RemediationService);
//# sourceMappingURL=remediation.service.js.map