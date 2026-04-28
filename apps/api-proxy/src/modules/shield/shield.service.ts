import { Injectable } from '@nestjs/common';
import type { RequestContext, ThreatType } from '@sentinel/shared-types';

export interface HeuristicResult {
  score: number;
  confidence: number;
  threatType?: ThreatType;
  reasons: string[];
}

@Injectable()
export class ShieldService {
  // Patterns ordered by severity. Score 0-100.
  private readonly patterns: Array<{
    name: string;
    threatType: ThreatType;
    regex: RegExp;
    score: number;
  }> = [
    // === SQL INJECTION ===
    { name: 'SQLi - UNION SELECT', threatType: 'SQL_INJECTION', regex: /union\s+select/i, score: 85 },
    { name: 'SQLi - sleep/benchmark', threatType: 'SQL_INJECTION', regex: /(sleep\s*\(|benchmark\s*\()/i, score: 90 },
    { name: 'SQLi - Comment dash', threatType: 'SQL_INJECTION', regex: /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, score: 55 },
    { name: 'SQLi - OR / AND injection', threatType: 'SQL_INJECTION', regex: /(\bor\b|\band\b)\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i, score: 75 },
    { name: 'SQLi - tautology OR 1=1', threatType: 'SQL_INJECTION', regex: /or\s+['"]?1['"]?\s*=\s*['"]?1['"]?/i, score: 90 },
    { name: 'SQLi - Stacked query', threatType: 'SQL_INJECTION', regex: /;\s*(select|insert|update|delete|drop|create|alter)/i, score: 90 },
    { name: 'SQLi - Information schema', threatType: 'SQL_INJECTION', regex: /information_schema\.(tables|columns)/i, score: 80 },
    { name: 'SQLi - INTO OUTFILE / DUMPFILE', threatType: 'SQL_INJECTION', regex: /into\s+(outfile|dumpfile)/i, score: 85 },
    { name: 'SQLi - GROUP BY / HAVING', threatType: 'SQL_INJECTION', regex: /group\s+by.+having/i, score: 70 },
    // === NOSQL INJECTION ===
    { name: 'NoSQLi - $operator injection', threatType: 'NOSQL_INJECTION', regex: /\$(eq|ne|gt|gte|lt|lte|in|nin|regex|where|or|and|not|exists|type)\s*:/i, score: 80 },
    { name: 'NoSQLi - $where function', threatType: 'NOSQL_INJECTION', regex: /\$where\s*:\s*['"]function/i, score: 90 },
    // === XSS ===
    { name: 'XSS - Script tag', threatType: 'XSS', regex: /<script[^>]*>[\s\S]*?<\/script>/i, score: 85 },
    { name: 'XSS - Event handler', threatType: 'XSS', regex: /(on\w+\s*=\s*["']?[^"'>]+)/i, score: 75 },
    { name: 'XSS - JavaScript protocol', threatType: 'XSS', regex: /javascript:/i, score: 80 },
    { name: 'XSS - SVG onload', threatType: 'XSS', regex: /<svg[^>]*onload\s*=/i, score: 85 },
    { name: 'XSS - iframe/srcdoc', threatType: 'XSS', regex: /<iframe[^>]*srcdoc\s*=/i, score: 80 },
    // === COMMAND INJECTION ===
    { name: 'Command Injection - backtick', threatType: 'COMMAND_INJECTION', regex: /`[^`]*`/, score: 85 },
    { name: 'Command Injection - $(cmd)', threatType: 'COMMAND_INJECTION', regex: /\$\([^)]+\)/, score: 85 },
    { name: 'Command Injection - chained command', threatType: 'COMMAND_INJECTION', regex: /(;|\||&&)\s*(cat|ls|id|whoami|pwd|echo|rm|curl|wget|bash|sh|python|perl|ruby|nc|netcat)/i, score: 75 },
    { name: 'Command Injection - /bin/sh', threatType: 'COMMAND_INJECTION', regex: /(\/bin\/sh|\/bin\/bash|cmd\.exe|powershell\.exe)/i, score: 90 },
    // === PATH TRAVERSAL ===
    { name: 'Path Traversal - dot-dot-slash', threatType: 'PATH_TRAVERSAL', regex: /\.\.[\/\\]|\.\.\%2[fF]|\.\.\%5[cC]/, score: 80 },
    { name: 'Path Traversal - absolute /etc', threatType: 'PATH_TRAVERSAL', regex: /\/etc\/passwd|\/etc\/shadow|\/proc\/self|\/windows\/system32/i, score: 85 },
    { name: 'Path Traversal - null byte', threatType: 'PATH_TRAVERSAL', regex: /\x00/, score: 85 },
    // === SSRF ===
    { name: 'SSRF - Internal IP', threatType: 'SSRF', regex: /(http[s]?:\/\/(127\.0\.0\.1|localhost|0\.0\.0\.0|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+|::1|\[::1\]))/i, score: 85 },
    { name: 'SSRF - File protocol', threatType: 'SSRF', regex: /file:\/\//i, score: 80 },
    { name: 'SSRF - Gopher/FTP/Dict', threatType: 'SSRF', regex: /(gopher|ftp|dict|ldap):\/\//i, score: 80 },
    // === DLP / EXFILTRATION ===
    { name: 'DLP - SSN pattern', threatType: 'DLP_EXFILTRATION', regex: /\b\d{3}-\d{2}-\d{4}\b/, score: 65 },
    { name: 'DLP - Credit Card', threatType: 'DLP_EXFILTRATION', regex: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12})\b/, score: 70 },
    { name: 'DLP - Email exfiltration', threatType: 'DLP_EXFILTRATION', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, score: 30 },
    { name: 'DLP - CPF pattern', threatType: 'DLP_EXFILTRATION', regex: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/, score: 55 },
    { name: 'DLP - API Key leak', threatType: 'DLP_EXFILTRATION', regex: /(sk-[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16}|ghp_[a-zA-Z0-9]{36})/i, score: 75 },
    // === PROMPT INJECTION ===
    { name: 'Prompt Injection - ignore previous', threatType: 'PROMPT_INJECTION', regex: /ignore\s+(all\s+)?previous\s+(instructions?|prompts?)/i, score: 80 },
    { name: 'Prompt Injection - system override', threatType: 'PROMPT_INJECTION', regex: /(you are now|act as|pretend to be|ignore your instructions)/i, score: 75 },
    { name: 'Prompt Injection - delimiter break', threatType: 'PROMPT_INJECTION', regex: /(<\/?system>|<\/?user>|<\/?assistant>)/i, score: 70 },
  ];

  analyze(ctx: RequestContext): HeuristicResult {
    const reasons: string[] = [];
    let maxScore = 0;
    let primaryThreat: ThreatType | undefined;
    let matches = 0;

    // Aggressive normalization to catch bypasses
    const rawText = this.extractCheckableText(ctx);
    const variants = this.generateVariants(rawText);

    for (const variant of variants) {
      for (const pattern of this.patterns) {
        if (pattern.regex.test(variant)) {
          // Prevent duplicate reasons for same pattern
          const reason = `Pattern matched: ${pattern.name} (+${pattern.score})`;
          if (!reasons.includes(reason)) {
            matches++;
            reasons.push(reason);
            if (pattern.score > maxScore) {
              maxScore = pattern.score;
              primaryThreat = pattern.threatType;
            }
          }
        }
      }
    }

    // Honeypot trigger
    if (ctx.path.includes('honeypot') || /\/admin\/(backup|config|debug)/i.test(ctx.path)) {
      maxScore = Math.max(maxScore, 98);
      primaryThreat = 'HONEYPOT_TRIGGER';
      reasons.push('Honeypot endpoint accessed (+98)');
    }

    // Header anomalies
    const ua = (ctx.userAgent || '').toLowerCase();
    if (!ctx.userAgent || ctx.userAgent === 'unknown' || ua === '') {
      maxScore = Math.max(maxScore, 10);
      reasons.push('Missing user-agent (+10)');
    }
    if (ua.includes('sqlmap') || ua.includes('nikto') || ua.includes('nmap') || ua.includes('gobuster')) {
      maxScore = Math.max(maxScore, 60);
      primaryThreat = primaryThreat || 'BEHAVIORAL_ANOMALY';
      reasons.push('Scanner user-agent detected (+60)');
    }

    // JSON-based SQLi / NoSQLi deep check
    if (ctx.body && typeof ctx.body === 'object') {
      const bodyStr = JSON.stringify(ctx.body);
      const decodedBody = this.decodeNestedUnicode(bodyStr);
      if (decodedBody !== bodyStr) {
        // Re-check decoded body
        for (const pattern of this.patterns) {
          if (pattern.regex.test(decodedBody)) {
            const reason = `Decoded body pattern: ${pattern.name} (+${pattern.score})`;
            if (!reasons.includes(reason)) {
              matches++;
              reasons.push(reason);
              if (pattern.score > maxScore) {
                maxScore = pattern.score;
                primaryThreat = pattern.threatType;
              }
            }
          }
        }
      }
    }

    // Obfuscation penalty: if we detect encoding tricks, boost score
    const obfuscationScore = this.detectObfuscation(rawText);
    if (obfuscationScore > 0) {
      maxScore = Math.min(100, maxScore + obfuscationScore);
      reasons.push(`Obfuscation detected (+${obfuscationScore})`);
    }

    const confidence = Math.min(0.98, 0.25 + matches * 0.18 + (obfuscationScore > 0 ? 0.15 : 0));

    return {
      score: Math.min(100, maxScore),
      confidence: Math.round(confidence * 100) / 100,
      threatType: primaryThreat,
      reasons,
    };
  }

  private extractCheckableText(ctx: RequestContext): string {
    const parts: string[] = [
      ctx.path,
      JSON.stringify(ctx.query),
      JSON.stringify(ctx.headers),
    ];
    if (ctx.body !== undefined) {
      parts.push(typeof ctx.body === 'string' ? ctx.body : JSON.stringify(ctx.body));
    }
    return parts.join(' ');
  }

  private generateVariants(text: string): string[] {
    const variants = new Set<string>();
    variants.add(text);
    variants.add(decodeURIComponent(text).replace(/\+/g, ' '));
    variants.add(this.decodeNestedUnicode(text));
    variants.add(this.normalizeSqlComments(text));
    variants.add(this.normalizeWhitespace(text));
    // Lowercase variants
    for (const v of Array.from(variants)) {
      variants.add(v.toLowerCase());
    }
    return Array.from(variants);
  }

  private decodeNestedUnicode(text: string): string {
    // Decode \u0027, \u005c, etc.
    return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  }

  private normalizeSqlComments(text: string): string {
    // Remove SQL comments that bypass filters: /**/, #, --, /*!50000*/
    return text
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/\/\*!\d+/g, ' ')
      .replace(/#/g, ' ')
      .replace(/--/g, ' ')
      .replace(/\x00/g, ' ');
  }

  private normalizeWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  private detectObfuscation(text: string): number {
    let score = 0;
    // Double encoding
    if (/\%25[0-9a-fA-F]{2}/.test(text)) score += 15;
    // HTML entities
    if (/&#[xX]?[0-9a-fA-F]+;/.test(text)) score += 10;
    // Excessive unicode escapes
    if ((text.match(/\\u[0-9a-fA-F]{4}/g) || []).length > 2) score += 15;
    // Null bytes
    if (/\x00/.test(text)) score += 20;
    // Mixed case SQL keywords with comments between chars
    if (/s\/\*.*?\*\/e\/\*.*?\*\/l\/\*.*?\*\/e\/\*.*?\*\/c\/\*.*?\*\/t/i.test(text)) score += 25;
    return score;
  }
}
