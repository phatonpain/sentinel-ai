import type { RequestContext, ThreatType } from '@sentinel/shared-types';
export interface HeuristicResult {
    score: number;
    confidence: number;
    threatType?: ThreatType;
    reasons: string[];
}
export declare class ShieldService {
    private readonly patterns;
    analyze(ctx: RequestContext): HeuristicResult;
    private extractCheckableText;
    private generateVariants;
    private decodeNestedUnicode;
    private normalizeSqlComments;
    private normalizeWhitespace;
    private detectObfuscation;
}
//# sourceMappingURL=shield.service.d.ts.map