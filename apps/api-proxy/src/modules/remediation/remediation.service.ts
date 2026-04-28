import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { RequestContext, SecurityDecision, RemediationAction } from '@sentinel/shared-types';

@Injectable()
export class RemediationService {
  private readonly logger = new Logger(RemediationService.name);
  private readonly redis: Redis;
  private readonly slackWebhook?: string;
  private readonly pagerdutyKey?: string;

  constructor(private readonly config: ConfigService) {
    const redisUrl = this.config.get<string>('redisUrl') || 'redis://localhost:6379';
    this.redis = new Redis(redisUrl);
    this.slackWebhook = this.config.get<string>('SLACK_WEBHOOK_URL') || undefined;
    this.pagerdutyKey = this.config.get<string>('PAGERDUTY_INTEGRATION_KEY') || undefined;
  }

  async execute(ctx: RequestContext, decision: SecurityDecision): Promise<RemediationAction[]> {
    const actions: RemediationAction[] = [
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
    } else if (decision.riskScore >= 70) {
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

  private async banIp(ctx: RequestContext, decision: SecurityDecision): Promise<void> {
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
    } catch {
      // Ignore Redis errors
    }
  }

  private async sendSlack(ctx: RequestContext, decision: SecurityDecision): Promise<void> {
    if (!this.slackWebhook) return;
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
    } catch (err) {
      this.logger.error({ msg: 'Slack notification failed', err: (err as Error).message });
    }
  }

  private async sendPagerDuty(ctx: RequestContext, decision: SecurityDecision, severity: 'critical' | 'error' | 'warning'): Promise<void> {
    if (!this.pagerdutyKey) return;
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
    } catch (err) {
      this.logger.error({ msg: 'PagerDuty notification failed', err: (err as Error).message });
    }
  }
}
