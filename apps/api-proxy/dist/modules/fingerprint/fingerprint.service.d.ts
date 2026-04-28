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
export declare class FingerprintService {
    private readonly prisma;
    private readonly logger;
    private readonly requestTimestamps;
    private readonly markovChains;
    private readonly featureBaselines;
    private readonly lastEndpoints;
    constructor(prisma: PrismaService);
    score(ctx: RequestContext): Promise<number>;
    record(ctx: RequestContext): Promise<void>;
    getProfile(identityId: string, tenantId?: string): Promise<BehaviorProfile | null>;
    updateBaseline(identityId: string, _tenantId?: string): Promise<void>;
    private extractFeatures;
    private calculateZScoreAnomaly;
    private initializeBaseline;
    private updateFeatureBaseline;
    private calculateMarkovAnomaly;
    private updateMarkovChain;
    private calculateEmbeddingSimilarity;
    private upsertBehaviorProfile;
    private guessCountry;
    private countSpecialChars;
    private calculateEntropy;
    private countJsonKeys;
    private maxNestingDepth;
}
//# sourceMappingURL=fingerprint.service.d.ts.map