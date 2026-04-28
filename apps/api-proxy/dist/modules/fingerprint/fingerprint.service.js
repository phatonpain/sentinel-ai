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
var FingerprintService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerprintService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FingerprintService = FingerprintService_1 = class FingerprintService {
    prisma;
    logger = new common_1.Logger(FingerprintService_1.name);
    // In-memory caches for velocity and Markov chains (per tenant+identity)
    requestTimestamps = new Map();
    markovChains = new Map();
    featureBaselines = new Map();
    lastEndpoints = new Map();
    constructor(prisma) {
        this.prisma = prisma;
    }
    async score(ctx) {
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
    async record(ctx) {
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
    async getProfile(identityId, tenantId = 'default') {
        const row = await this.prisma.$queryRaw `
      SELECT tenant_id, identity_id, temporal_profile, geo_profile, payload_stats, velocity_stats, graph_profile, anomaly_score, last_seen
      FROM behavior_profiles
      WHERE tenant_id = ${tenantId} AND identity_id = ${identityId}
      LIMIT 1
    `;
        if (!row || row.length === 0)
            return null;
        const r = row[0];
        return {
            tenantId: r.tenant_id,
            identityId: r.identity_id,
            temporalProfile: r.temporal_profile,
            geoProfile: r.geo_profile,
            payloadStats: r.payload_stats,
            velocityStats: r.velocity_stats,
            graphProfile: r.graph_profile,
            anomalyScore: r.anomaly_score,
            lastSeen: r.last_seen,
        };
    }
    async updateBaseline(identityId, _tenantId = 'default') {
        // Placeholder for nightly batch retraining
        this.logger.log(`Baseline update queued for ${identityId}`);
    }
    extractFeatures(ctx) {
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
            contentType: ctx.headers['content-type'] || 'unknown',
            requestsLastMinute: 0,
            requestsLastHour: 0,
            averageIntervalMs: 0,
            errorRateLastHour: 0,
            previousEndpoint: this.lastEndpoints.get(key) || null,
            transitionProbability: 0.5,
        };
    }
    calculateZScoreAnomaly(key, features) {
        const baseline = this.featureBaselines.get(key);
        if (!baseline) {
            this.initializeBaseline(key, features);
            return 0;
        }
        const criticalFeatures = ['payloadLength', 'shannonEntropy', 'numSpecialChars', 'numJsonKeys'];
        let maxZ = 0;
        for (const name of criticalFeatures) {
            const value = features[name];
            const stat = baseline.get(name);
            if (!stat || stat.count < 10)
                continue;
            const z = Math.abs((value - stat.mean) / (stat.std || 1));
            if (z > maxZ)
                maxZ = z;
        }
        if (maxZ > 4)
            return 1.0;
        if (maxZ > 3)
            return 0.6;
        if (maxZ > 2)
            return 0.3;
        return 0;
    }
    initializeBaseline(key, features) {
        const map = new Map();
        for (const name of ['payloadLength', 'shannonEntropy', 'numSpecialChars', 'numJsonKeys']) {
            const value = features[name];
            map.set(name, { mean: value, std: 0, count: 1 });
        }
        this.featureBaselines.set(key, map);
    }
    updateFeatureBaseline(key, features) {
        let baseline = this.featureBaselines.get(key);
        if (!baseline) {
            this.initializeBaseline(key, features);
            baseline = this.featureBaselines.get(key);
        }
        for (const name of ['payloadLength', 'shannonEntropy', 'numSpecialChars', 'numJsonKeys']) {
            const value = features[name];
            const stat = baseline.get(name);
            if (!stat)
                continue;
            // Welford's online algorithm for mean and variance
            const n = stat.count + 1;
            const delta = value - stat.mean;
            const newMean = stat.mean + delta / n;
            const newStd = Math.sqrt(((stat.std * stat.std * stat.count) + (delta * (value - newMean))) / n);
            baseline.set(name, { mean: newMean, std: newStd || 0, count: n });
        }
    }
    calculateMarkovAnomaly(key, features, currentEndpoint) {
        const chain = this.markovChains.get(key);
        if (!chain || !features.previousEndpoint)
            return 0;
        const fromMap = chain.get(features.previousEndpoint);
        if (!fromMap)
            return 0.5; // Never seen this transition before
        const total = Array.from(fromMap.values()).reduce((a, b) => a + b, 0);
        const prob = total > 0 ? (fromMap.get(currentEndpoint) || 0) / total : 0;
        if (prob < 0.01)
            return 0.8;
        if (prob < 0.05)
            return 0.4;
        return 0;
    }
    updateMarkovChain(key, from, to) {
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
    async calculateEmbeddingSimilarity(_tenantId, _identityId, _ctx) {
        // Without OpenAI embeddings configured, we skip pgvector similarity
        // In production, this would call OpenAI to generate embedding and query pgvector
        return 0;
    }
    async upsertBehaviorProfile(tenantId, identityId, features) {
        try {
            await this.prisma.$executeRaw `
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
        }
        catch (err) {
            this.logger.error({ msg: 'Failed to upsert behavior profile', err: err.message });
        }
    }
    guessCountry(ip) {
        if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip === '127.0.0.1' || ip === '::1') {
            return 'LOCAL';
        }
        return 'UNKNOWN';
    }
    countSpecialChars(str) {
        return (str.match(/[^a-zA-Z0-9\s]/g) || []).length;
    }
    calculateEntropy(str) {
        const freq = new Map();
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
    countJsonKeys(obj) {
        if (obj === null || typeof obj !== 'object')
            return 0;
        return Object.keys(obj).length;
    }
    maxNestingDepth(obj) {
        if (obj === null || typeof obj !== 'object')
            return 0;
        let max = 0;
        for (const value of Object.values(obj)) {
            const d = this.maxNestingDepth(value);
            if (d > max)
                max = d;
        }
        return max + 1;
    }
};
exports.FingerprintService = FingerprintService;
exports.FingerprintService = FingerprintService = FingerprintService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FingerprintService);
//# sourceMappingURL=fingerprint.service.js.map