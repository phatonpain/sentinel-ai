export interface InspectRequestDto {
    context: import('./security').RequestContext;
    options?: {
        mode?: 'block' | 'monitor' | 'challenge';
        autoRemediate?: boolean;
    };
}
export interface InspectResponseDto {
    decision: import('./security').SecurityDecision;
    forensics?: {
        headersSnapshot: Record<string, string | string[]>;
        bodyTruncated?: string;
        timing: {
            parseMs: number;
            heuristicMs: number;
            mlMs: number;
            llmMs: number;
            totalMs: number;
        };
    };
}
export interface ThreatListItem {
    id: string;
    incidentId: string;
    type: string;
    severity: string;
    confidence: number;
    sourceIp: string;
    path: string;
    createdAt: string;
    resolvedAt?: string;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=api.d.ts.map