import type { RequestContext } from '@sentinel/shared-types';
export interface HoneypotEndpoint {
    id: string;
    path: string;
    method: string;
    responseStatus: number;
    responseBody: Record<string, unknown>;
    delayMs: number;
    tags: string[];
}
export interface HoneypotResult {
    triggered: boolean;
    endpoint?: HoneypotEndpoint;
    score: number;
    forensics: {
        timestamp: string;
        sourceIp: string;
        userAgent: string;
        headers: Record<string, string | string[]>;
    };
}
export declare class HoneypotService {
    private readonly logger;
    private readonly endpoints;
    constructor();
    check(ctx: RequestContext): HoneypotResult;
    getEndpoints(): HoneypotEndpoint[];
    addEndpoint(ep: Omit<HoneypotEndpoint, 'id'>): HoneypotEndpoint;
    removeEndpoint(method: string, path: string): boolean;
    private deployDefaults;
}
//# sourceMappingURL=honeypot.service.d.ts.map