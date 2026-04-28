declare class TimingDto {
    parseMs: number;
    heuristicMs: number;
    fingerprintMs: number;
    mlMs: number;
    llmMs: number;
    dlpMs: number;
    honeypotMs: number;
    rateLimitMs: number;
    totalMs: number;
}
declare class DlpMatchDto {
    ruleId: string;
    ruleName: string;
    category: string;
    severity: string;
    matchedText: string;
    position: number;
    score: number;
}
declare class DlpResultDto {
    score: number;
    matches: DlpMatchDto[];
    redactedPayload?: string;
}
declare class RateLimitResultDto {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    limit: number;
    windowMs: number;
    retryAfterMs?: number;
    burstDetected?: boolean;
}
declare class ForensicsDto {
    headersSnapshot: Record<string, string | string[]>;
    bodyTruncated?: string;
    timing: TimingDto;
    dlp?: DlpResultDto;
    rateLimit?: RateLimitResultDto;
}
declare class DecisionDto {
    verdict: 'ALLOW' | 'BLOCK' | 'CHALLENGE';
    riskScore: number;
    incidentId?: string;
    threatType?: string;
    confidence: number;
    reasons: string[];
    latencyMs?: number;
}
export declare class InspectResponseDto {
    decision: DecisionDto;
    forensics?: ForensicsDto;
}
export {};
//# sourceMappingURL=inspect-response.dto.d.ts.map