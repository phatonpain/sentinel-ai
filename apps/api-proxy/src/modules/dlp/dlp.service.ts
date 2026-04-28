import { Injectable, Logger } from '@nestjs/common';
import type { RequestContext } from '@sentinel/shared-types';

export interface DlpRule {
  id: string;
  name: string;
  category: 'PII' | 'FINANCIAL' | 'HEALTH' | 'CORPORATE' | 'CUSTOM';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  pattern: RegExp;
  score: number;
  description: string;
  enabled: boolean;
}

export interface DlpResult {
  score: number;
  matches: DlpMatch[];
  redactedPayload?: string;
}

export interface DlpMatch {
  ruleId: string;
  ruleName: string;
  category: string;
  severity: string;
  matchedText: string;
  position: number;
  score: number;
}

@Injectable()
export class DlpService {
  private readonly logger = new Logger(DlpService.name);
  private readonly rules: DlpRule[];

  constructor() {
    this.rules = this.buildDefaultRules();
  }

  analyze(ctx: RequestContext): DlpResult {
    const payload = this.extractPayload(ctx);
    if (!payload) return { score: 0, matches: [] };

    const matches: DlpMatch[] = [];

    for (const rule of this.rules) {
      if (!rule.enabled) continue;
      const found = this.findMatches(payload, rule);
      matches.push(...found);
    }

    // Anti-dilution: highest single match dominates, compounded by count
    const maxMatchScore = matches.length > 0 ? Math.max(...matches.map((m) => m.score)) : 0;
    const countMultiplier = Math.min(1 + (matches.length - 1) * 0.15, 1.5);
    const score = Math.min(100, Math.round(maxMatchScore * countMultiplier));

    const redacted = score > 0 ? this.redactPayload(payload, matches) : undefined;

    if (score > 0) {
      this.logger.warn({
        msg: 'DLP match detected',
        requestId: ctx.requestId,
        tenantId: ctx.tenantId,
        score,
        categories: [...new Set(matches.map((m) => m.category))],
      });
    }

    return { score, matches, redactedPayload: redacted };
  }

  getRules(): DlpRule[] {
    return this.rules.map((r) => ({ ...r, pattern: undefined as unknown as RegExp })) as any;
  }

  private extractPayload(ctx: RequestContext): string {
    const parts: string[] = [];
    if (ctx.body) {
      parts.push(typeof ctx.body === 'string' ? ctx.body : JSON.stringify(ctx.body));
    }
    if (ctx.query) {
      parts.push(JSON.stringify(ctx.query));
    }
    for (const [k, v] of Object.entries(ctx.headers)) {
      if (typeof v === 'string') parts.push(`${k}: ${v}`);
      else if (Array.isArray(v)) parts.push(...v.map((val) => `${k}: ${val}`));
    }
    return parts.join('\n');
  }

  private findMatches(text: string, rule: DlpRule): DlpMatch[] {
    const matches: DlpMatch[] = [];
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags.includes('g') ? rule.pattern.flags : rule.pattern.flags + 'g');
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      matches.push({
        ruleId: rule.id,
        ruleName: rule.name,
        category: rule.category,
        severity: rule.severity,
        matchedText: m[0].substring(0, 50),
        position: m.index,
        score: rule.score,
      });
    }
    return matches;
  }

  private redactPayload(payload: string, matches: DlpMatch[]): string {
    let redacted = payload;
    // Sort by position descending so replacements don't shift indices
    const sorted = [...matches].sort((a, b) => b.position - a.position);
    for (const m of sorted) {
      const end = m.position + m.matchedText.length;
      redacted = redacted.substring(0, m.position) + '[REDACTED]' + redacted.substring(end);
    }
    return redacted;
  }

  private buildDefaultRules(): DlpRule[] {
    return [
      // PII
      {
        id: 'dlp-pii-cpf-br',
        name: 'Brazilian CPF',
        category: 'PII',
        severity: 'HIGH',
        pattern: /\b\d{3}[.\s]?\d{3}[.\s]?\d{3}[-\s]?\d{2}\b/,
        score: 75,
        description: 'Brazilian CPF number pattern',
        enabled: true,
      },
      {
        id: 'dlp-pii-ssn',
        name: 'US SSN',
        category: 'PII',
        severity: 'CRITICAL',
        pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/,
        score: 85,
        description: 'US Social Security Number',
        enabled: true,
      },
      {
        id: 'dlp-pii-email',
        name: 'Email Address',
        category: 'PII',
        severity: 'MEDIUM',
        pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
        score: 40,
        description: 'Email address pattern',
        enabled: true,
      },
      {
        id: 'dlp-pii-phone-br',
        name: 'Brazilian Phone',
        category: 'PII',
        severity: 'MEDIUM',
        pattern: /\b(?:\+55\s?)?\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}\b/,
        score: 45,
        description: 'Brazilian phone number',
        enabled: true,
      },
      // Financial
      {
        id: 'dlp-fin-cc',
        name: 'Credit Card',
        category: 'FINANCIAL',
        severity: 'CRITICAL',
        pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b/,
        score: 90,
        description: 'Major credit card numbers (Visa, Mastercard, Amex, etc)',
        enabled: true,
      },
      {
        id: 'dlp-fin-iban',
        name: 'IBAN',
        category: 'FINANCIAL',
        severity: 'HIGH',
        pattern: /\b[A-Z]{2}\d{2}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}[\s]?[A-Z0-9]{4}\b/,
        score: 70,
        description: 'International Bank Account Number',
        enabled: true,
      },
      {
        id: 'dlp-fin-bitcoin',
        name: 'Crypto Wallet',
        category: 'FINANCIAL',
        severity: 'MEDIUM',
        pattern: /\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}\b/,
        score: 50,
        description: 'Bitcoin or similar cryptocurrency address',
        enabled: true,
      },
      // Corporate
      {
        id: 'dlp-corp-apikey',
        name: 'API Key Pattern',
        category: 'CORPORATE',
        severity: 'HIGH',
        pattern: /\b(?:sk-|pk-|ak-|api[_-]?key\s*[:=]\s*)([a-zA-Z0-9_-]{16,64})\b/i,
        score: 65,
        description: 'Generic API key or secret token',
        enabled: true,
      },
      {
        id: 'dlp-corp-aws-key',
        name: 'AWS Access Key',
        category: 'CORPORATE',
        severity: 'CRITICAL',
        pattern: /\bAKIA[0-9A-Z]{16}\b/,
        score: 80,
        description: 'AWS Access Key ID',
        enabled: true,
      },
      {
        id: 'dlp-corp-github-token',
        name: 'GitHub Token',
        category: 'CORPORATE',
        severity: 'CRITICAL',
        pattern: /\bgh[pousr]_[A-Za-z0-9_]{36,}\b/,
        score: 80,
        description: 'GitHub personal or OAuth token',
        enabled: true,
      },
      {
        id: 'dlp-corp-private-key',
        name: 'Private Key',
        category: 'CORPORATE',
        severity: 'CRITICAL',
        pattern: /-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/,
        score: 95,
        description: 'PEM private key block',
        enabled: true,
      },
      {
        id: 'dlp-corp-jwt',
        name: 'JWT Token',
        category: 'CORPORATE',
        severity: 'MEDIUM',
        pattern: /\beyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*\b/,
        score: 45,
        description: 'JSON Web Token pattern',
        enabled: true,
      },
      // Health
      {
        id: 'dlp-health-mrn',
        name: 'Medical Record Number',
        category: 'HEALTH',
        severity: 'HIGH',
        pattern: /\bMRN[\s:-]?\d{6,10}\b/i,
        score: 60,
        description: 'Medical record number',
        enabled: true,
      },
    ];
  }
}
