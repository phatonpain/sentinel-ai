import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { RequestContext } from '@sentinel/shared-types';

export interface BehavioralFeatures {
  hourOfDay: number;
  dayOfWeek: number;
  daysSinceFirstSeen: number;
  countryCode: string;
  asn: string;
  isVpn: boolean;
  isTor: boolean;
  isDatacenter: boolean;
  payloadLength: number;
  numSpecialChars: number;
  shannonEntropy: number;
  numJsonKeys: number;
  nestingDepth: number;
  hasBase64: boolean;
  hasUnicodeEscape: boolean;
  hasHexEncoding: boolean;
  contentType: string;
  requestsLastMinute: number;
  requestsLastHour: number;
  averageIntervalMs: number;
  errorRateLastHour: number;
  previousEndpoint: string | null;
  transitionProbability: number;
}

export interface BehaviorProfile {
  tenantId: string;
  identityId: string;
  temporalProfile: Record<string, unknown>;
  geoProfile: Record<string, unknown>;
  payloadStats: Record<string, unknown>;
  velocityStats: Record<string, unknown>;
  graphProfile: Record<string, unknown>;
  anomalyScore: number;
  lastSeen: Date;
}

@Injectable()
export class FingerprintService {
  private readonly logger = new Logger(FingerprintService.name);
  // In-memory caches for velocity and Markov chains (per tenant+identity)
  private readonly requestTimestamps = new Map<string, number[]>();
  private readonly markovChains = new Map<string, Map<string, Map<string, number>>>();
  private readonly featureBaselines = new Map<string, Map<string, { mean: number; std: number; count: number }>>();
  private readonly lastEndpoints = new Map<string, string>();

  constructor(private readonly prisma: PrismaService) {}

  async score(ctx: RequestContext): Promise<number> {
    const identityId = ctx.apiKey || ctx.sourceIp || 'anonymous';
    const tenantId = ctx.tenantId || 'default';
    const key = `${tenantId}:${identityId}`;

    const features = this.extractFeatures(ctx);

    // 1. Statistical Z-score (local)
    const zScoreAnomaly = this.calculateZScoreAnomaly(key, features);

    // 2. Markov chain anomaly (local)
    const markovAnomaly = this.calculateMarkovAnomaly(key, features, ctx.path);

    // 3. Embedding similarity (pgvector)
    const embeddingScore = await this.calculateEmbeddingSimilarity(tenantId, identityId, ctx);

    // Combine anomalies (max strategy)
    const maxAnomaly = Math.max(zScoreAnomaly, markovAnomaly, embeddingScore);
    const finalScore = Math.min(100, maxAnomaly * 100);

    this.logger.debug({
      identityId,
      zScore: zScoreAnomaly,
      markov: markovAnomaly,
      embedding: embeddingScore,
      final: finalScore,
    });

    return finalScore;
  }

  async record(ctx: RequestContext): Promise<void> {
    const identityId = ctx.apiKey || ctx.sourceIp || 'anonymous';
    const tenantId = ctx.tenantId || 'default';
    const key = `${tenantId}:${identityId}`;

    // Update velocity cache
    const now = Date.now();
    const timestamps = this.requestTimestamps.get(key) || [];
    timestamps.push(now);
    // Keep last 60 minutes
    const cutoff = now - 60 * 60 * 1000;
    const filtered = timestamps.filter((t) => t > cutoff);
    this.requestTimestamps.set(key, filtered);

    // Track last endpoint for next request
    const previousEndpoint = this.lastEndpoints.get(key) || null;
    this.lastEndpoints.set(key, ctx.path);

    // Update Markov chain
    if (previousEndpoint) {
      this.updateMarkovChain(key, previousEndpoint, ctx.path);
    }

    // Update Z-score baseline
    const features = this.extractFeatures(ctx);
    this.updateFeatureBaseline(key, features);

    // Upsert behavior profile (Prisma raw for pgvector unsupported, use upsert without vector)
    await this.upsertBehaviorProfile(tenantId, identityId, features);
  }

  async getProfile(identityId: string, tenantId = 'default'): Promise<BehaviorProfile | null> {
    const row = await this.prisma.$queryRaw<Array<{
      tenant_id: string;
      identity_id: string;
      temporal_profile: unknown;
      geo_profile: unknown;
      payload_stats: unknown;
      velocity_stats: unknown;
      graph_profile: unknown;
      anomaly_score: number;
      last_seen: Date;
    }>>`
      SELECT tenant_id, identity_id, temporal_profile, geo_profile, payload_stats, velocity_stats, graph_profile, anomaly_score, last_seen
      FROM behavior_profiles
      WHERE tenant_id = ${tenantId} AND identity_id = ${identityId}
      LIMIT 1
    `;

    if (!row || row.length === 0) return null;
    const r = row[0];
    return {
      tenantId: r.tenant_id,
      identityId: r.identity_id,
      temporalProfile: r.temporal_profile as Record<string, unknown>,
      geoProfile: r.geo_profile as Record<string, unknown>,
      payloadStats: r.payload_stats as Record<string, unknown>,
      velocityStats: r.velocity_stats as Record<string, unknown>,
      graphProfile: r.graph_profile as Record<string, unknown>,
      anomalyScore: r.anomaly_score,
      lastSeen: r.last_seen,
    };
  }

  async updateBaseline(identityId: string, _tenantId = 'default'): Promise<void> {
    // Placeholder for nightly batch retraining
    this.logger.log(`Baseline update queued for ${identityId}`);
  }

  private extractFeatures(ctx: RequestContext): BehavioralFeatures {
    const now = new Date();
    const payloadStr = typeof ctx.body === 'string' ? ctx.body : JSON.stringify(ctx.body || {});
    const identityId = ctx.apiKey || ctx.sourceIp || 'anonymous';
    const tenantId = ctx.tenantId || 'default';
    const key = `${tenantId}:${identityId}`;

    return {
      hourOfDay: now.getHours(),
      dayOfWeek: now.getDay(),
      daysSinceFirstSeen: 0, // Would be calculated from first seen date
      countryCode: this.guessCountry(ctx.sourceIp),
      asn: 'unknown',
      isVpn: false,
      isTor: false,
      isDatacenter: false,
      payloadLength: payloadStr.length,
      numSpecialChars: this.countSpecialChars(payloadStr),
      shannonEntropy: this.calculateEntropy(payloadStr),
      numJsonKeys: this.countJsonKeys(ctx.body),
      nestingDepth: this.maxNestingDepth(ctx.body),
      hasBase64: /[A-Za-z0-9+/]{40,}={0,2}/.test(payloadStr),
      hasUnicodeEscape: /\\u[0-9a-fA-F]{4}/.test(payloadStr),
      hasHexEncoding: /\\x[0-9a-fA-F]{2}/.test(payloadStr),
      contentType: (ctx.headers['content-type'] as string) || 'unknown',
      requestsLastMinute: 0,
      requestsLastHour: 0,
      averageIntervalMs: 0,
      errorRateLastHour: 0,
      previousEndpoint: this.lastEndpoints.get(key) || null,
      transitionProbability: 0.5,
    };
  }

  private calculateZScoreAnomaly(key: string, features: BehavioralFeatures): number {
    const baseline = this.featureBaselines.get(key);
    if (!baseline) {
      this.initializeBaseline(key, features);
      return 0;
    }

    const criticalFeatures = ['payloadLength', 'shannonEntropy', 'numSpecialChars', 'numJsonKeys'];
    let maxZ = 0;

    for (const name of criticalFeatures) {
      const value = features[name as keyof BehavioralFeatures] as number;
      const stat = baseline.get(name);
      if (!stat || stat.count < 10) continue;

      const z = Math.abs((value - stat.mean) / (stat.std || 1));
      if (z > maxZ) maxZ = z;
    }

    if (maxZ > 4) return 1.0;
    if (maxZ > 3) return 0.6;
    if (maxZ > 2) return 0.3;
    return 0;
  }

  private initializeBaseline(key: string, features: BehavioralFeatures): void {
    const map = new Map<string, { mean: number; std: number; count: number }>();
    for (const name of ['payloadLength', 'shannonEntropy', 'numSpecialChars', 'numJsonKeys']) {
      const value = features[name as keyof BehavioralFeatures] as number;
      map.set(name, { mean: value, std: 0, count: 1 });
    }
    this.featureBaselines.set(key, map);
  }

  private updateFeatureBaseline(key: string, features: BehavioralFeatures): void {
    let baseline = this.featureBaselines.get(key);
    if (!baseline) {
      this.initializeBaseline(key, features);
      baseline = this.featureBaselines.get(key)!;
    }

    for (const name of ['payloadLength', 'shannonEntropy', 'numSpecialChars', 'numJsonKeys']) {
      const value = features[name as keyof BehavioralFeatures] as number;
      const stat = baseline.get(name);
      if (!stat) continue;

      // Welford's online algorithm for mean and variance
      const n = stat.count + 1;
      const delta = value - stat.mean;
      const newMean = stat.mean + delta / n;
      const newStd = Math.sqrt(
        ((stat.std * stat.std * stat.count) + (delta * (value - newMean))) / n,
      );
      baseline.set(name, { mean: newMean, std: newStd || 0, count: n });
    }
  }

  private calculateMarkovAnomaly(key: string, features: BehavioralFeatures, currentEndpoint: string): number {
    const chain = this.markovChains.get(key);
    if (!chain || !features.previousEndpoint) return 0;

    const fromMap = chain.get(features.previousEndpoint);
    if (!fromMap) return 0.5; // Never seen this transition before

    const total = Array.from(fromMap.values()).reduce((a, b) => a + b, 0);
    const prob = total > 0 ? (fromMap.get(currentEndpoint) || 0) / total : 0;

    if (prob < 0.01) return 0.8;
    if (prob < 0.05) return 0.4;
    return 0;
  }

  private updateMarkovChain(key: string, from: string, to: string): void {
    let chain = this.markovChains.get(key);
    if (!chain) {
      chain = new Map();
      this.markovChains.set(key, chain);
    }
    let fromMap = chain.get(from);
    if (!fromMap) {
      fromMap = new Map();
      chain.set(from, fromMap);
    }
    fromMap.set(to, (fromMap.get(to) || 0) + 1);
  }

  private async calculateEmbeddingSimilarity(
    _tenantId: string,
    _identityId: string,
    _ctx: RequestContext,
  ): Promise<number> {
    // Without OpenAI embeddings configured, we skip pgvector similarity
    // In production, this would call OpenAI to generate embedding and query pgvector
    return 0;
  }

  private async upsertBehaviorProfile(
    tenantId: string,
    identityId: string,
    features: BehavioralFeatures,
  ): Promise<void> {
    try {
      await this.prisma.$executeRaw`
        INSERT INTO behavior_profiles (
          tenant_id, identity_id, temporal_profile, geo_profile, payload_stats, velocity_stats, graph_profile, last_seen, updated_at
        ) VALUES (
          ${tenantId}, ${identityId},
          ${JSON.stringify({ hourOfDay: features.hourOfDay, dayOfWeek: features.dayOfWeek })},
          ${JSON.stringify({ countryCode: features.countryCode, isVpn: features.isVpn, isTor: features.isTor })},
          ${JSON.stringify({ payloadLength: features.payloadLength, shannonEntropy: features.shannonEntropy, contentType: features.contentType })},
          ${JSON.stringify({ requestsLastMinute: features.requestsLastMinute, requestsLastHour: features.requestsLastHour })},
          ${JSON.stringify({ previousEndpoint: features.previousEndpoint, transitionProbability: features.transitionProbability })},
          NOW(), NOW()
        )
        ON CONFLICT (tenant_id, identity_id) DO UPDATE SET
          temporal_profile = EXCLUDED.temporal_profile,
          payload_stats = EXCLUDED.payload_stats,
          velocity_stats = EXCLUDED.velocity_stats,
          graph_profile = EXCLUDED.graph_profile,
          last_seen = NOW(),
          updated_at = NOW()
      `;
    } catch (err) {
      this.logger.error({ msg: 'Failed to upsert behavior profile', err: (err as Error).message });
    }
  }

  private guessCountry(ip: string): string {
    if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip === '127.0.0.1' || ip === '::1') {
      return 'LOCAL';
    }
    return 'UNKNOWN';
  }

  private countSpecialChars(str: string): number {
    return (str.match(/[^a-zA-Z0-9\s]/g) || []).length;
  }

  private calculateEntropy(str: string): number {
    const freq = new Map<string, number>();
    for (const char of str) {
      freq.set(char, (freq.get(char) || 0) + 1);
    }
    const len = str.length;
    let entropy = 0;
    for (const count of freq.values()) {
      const p = count / len;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }

  private countJsonKeys(obj: unknown): number {
    if (obj === null || typeof obj !== 'object') return 0;
    return Object.keys(obj).length;
  }

  private maxNestingDepth(obj: unknown): number {
    if (obj === null || typeof obj !== 'object') return 0;
    let max = 0;
    for (const value of Object.values(obj)) {
      const d = this.maxNestingDepth(value);
      if (d > max) max = d;
    }
    return max + 1;
  }
}
