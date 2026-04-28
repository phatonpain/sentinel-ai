import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type { RequestContext, SecurityDecision } from '@sentinel/shared-types';
import { InspectRequestDto } from './dto/inspect-request.dto';
import { InspectResponseDto } from './dto/inspect-response.dto';
import { InspectorEngine } from './inspector.engine';
import { RemediationService } from '../remediation/remediation.service';
import { BillingService } from '../billing/billing.service';
import { AlertsGateway, AlertEvent } from '../websocket/alerts.gateway';

@Injectable()
export class InspectorService {
  private readonly logger = new Logger(InspectorService.name);

  constructor(
    private readonly engine: InspectorEngine,
    private readonly remediationService: RemediationService,
    private readonly billingService: BillingService,
    private readonly alertsGateway: AlertsGateway,
  ) {}

  async inspect(dto: InspectRequestDto): Promise<InspectResponseDto> {
    const context: RequestContext = {
      ...dto.context,
      requestId: dto.context.requestId || uuidv4(),
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
            incidentId: uuidv4(),
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
      const alert: AlertEvent = {
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
      const decision: SecurityDecision = {
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

  private maskIp(ip: string): string {
    if (!ip || ip === 'unknown') return ip;
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.*.*`;
    }
    return ip.substring(0, Math.min(ip.length, 8)) + '...';
  }

  private sanitizeHeaders(headers: Record<string, string | string[]>): Record<string, string | string[]> {
    const sensitive = ['authorization', 'cookie', 'x-api-key', 'x-sentinel-api-key'];
    const out: Record<string, string | string[]> = {};
    for (const [k, v] of Object.entries(headers)) {
      out[k] = sensitive.includes(k.toLowerCase()) ? '[REDACTED]' : v;
    }
    return out;
  }

  private truncateBody(body: unknown): string | undefined {
    if (body === undefined || body === null) return undefined;
    const str = typeof body === 'string' ? body : JSON.stringify(body);
    if (str.length <= 1024) return str;
    return str.substring(0, 1024) + '...[truncated]';
  }
}
