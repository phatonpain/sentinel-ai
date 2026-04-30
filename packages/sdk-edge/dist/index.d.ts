import type { SecurityDecision, RequestContext } from '@sentinel/shared-types';
export interface SentinelEdgeOptions {
    apiKey: string;
    endpoint: string;
    mode?: 'block' | 'monitor' | 'challenge';
    autoRemediate?: boolean;
    timeoutMs?: number;
}
export declare class SentinelEdge {
    private readonly opts;
    constructor(opts: SentinelEdgeOptions);
    inspect(context: RequestContext): Promise<SecurityDecision>;
}
export { SentinelEdge as default };
//# sourceMappingURL=index.d.ts.map