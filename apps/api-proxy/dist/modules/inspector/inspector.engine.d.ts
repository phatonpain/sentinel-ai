import type { RequestContext, ThreatType, Verdict } from '@sentinel/shared-types';
import { ShieldService } from '../shield/shield.service';
import { FingerprintService } from '../fingerprint/fingerprint.service';
import { MlServiceClient } from '../ml/ml.service';
import { SemanticAnalyzerService } from './semantic-analyzer.service';
import { HoneypotService, HoneypotResult } from '../honeypot/honeypot.service';
import { DlpService, DlpResult } from '../dlp/dlp.service';
import { RateLimitService, RateLimitResult } from '../rate-limit/rate-limit.service';
export interface DetectionReason {
    layer: 'HEURISTIC' | 'FINGERPRINT' | 'ML' | 'LLM' | 'DLP' | 'HONEYPOT' | 'RATE_LIMIT';
    score: number;
    threatType?: ThreatType;
    explanation: string;
    confidence: number;
}
export interface InspectionResult {
    verdict: Verdict;
    finalScore: number;
    confidence: number;
    reasons: DetectionReason[];
    incidentId?: string;
    latencyBreakdown: {
        heuristicMs: number;
        fingerprintMs: number;
        mlMs: number;
        llmMs: number;
        dlpMs: number;
        honeypotMs: number;
        rateLimitMs: number;
        totalMs: number;
    };
    costBreakdown: {
        llmTokensIn: number;
        llmTokensOut: number;
        llmCostUsd: number;
    };
    dlp?: DlpResult;
    honeypot?: HoneypotResult;
    rateLimit?: RateLimitResult;
}
export declare class InspectorEngine {
    private readonly shieldService;
    private readonly fingerprintService;
    private readonly mlClient;
    private readonly semanticAnalyzer;
    private readonly honeypotService;
    private readonly dlpService;
    private readonly rateLimitService;
    constructor(shieldService: ShieldService, fingerprintService: FingerprintService, mlClient: MlServiceClient, semanticAnalyzer: SemanticAnalyzerService, honeypotService: HoneypotService, dlpService: DlpService, rateLimitService: RateLimitService);
    inspect(request: RequestContext): Promise<InspectionResult>;
    private buildResult;
}
//# sourceMappingURL=inspector.engine.d.ts.map