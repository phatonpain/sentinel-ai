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
export declare class DlpService {
    private readonly logger;
    private readonly rules;
    constructor();
    analyze(ctx: RequestContext): DlpResult;
    getRules(): DlpRule[];
    private extractPayload;
    private findMatches;
    private redactPayload;
    private buildDefaultRules;
}
//# sourceMappingURL=dlp.service.d.ts.map