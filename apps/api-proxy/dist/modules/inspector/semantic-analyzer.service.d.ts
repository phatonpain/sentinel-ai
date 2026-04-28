import { ConfigService } from '@nestjs/config';
import type { RequestContext, ThreatType } from '@sentinel/shared-types';
export interface SemanticAnalysisResult {
    riskScore: number;
    threatType: ThreatType | 'NONE';
    confidence: number;
    explanation: string;
    indicators: string[];
    tokensUsed: number;
    cached: boolean;
    latencyMs: number;
}
export declare class SemanticAnalyzerService {
    private readonly config;
    private readonly logger;
    private readonly redis;
    private readonly openaiApiKey;
    private readonly openaiBaseUrl;
    private readonly circuit;
    private readonly failureThreshold;
    private readonly resetTimeoutMs;
    private readonly maxTokens;
    private readonly temperature;
    constructor(config: ConfigService);
    analyze(request: RequestContext): Promise<SemanticAnalysisResult>;
    private callOpenAI;
    private buildPrompt;
    private sanitizeHeaders;
    private parseResponse;
    private normalizeThreatType;
    private buildCacheKey;
    private checkCache;
    private setCache;
    private checkQuota;
    private trackUsage;
    private fallbackResult;
    private isCircuitOpen;
    private onSuccess;
    private onFailure;
}
//# sourceMappingURL=semantic-analyzer.service.d.ts.map