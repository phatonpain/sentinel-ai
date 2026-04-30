import type { Request, Response, NextFunction } from 'express';
import type { SecurityDecision, RequestContext } from '@sentinel/shared-types';
export interface SentinelOptions {
    apiKey: string;
    endpoint: string;
    mode?: 'block' | 'monitor' | 'challenge';
    autoRemediate?: boolean;
    timeoutMs?: number;
    strictFailClosed?: boolean;
}
export declare class Sentinel {
    private readonly options;
    constructor(options: SentinelOptions);
    inspect(context: RequestContext): Promise<SecurityDecision>;
    middleware(): (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private buildFailClosedDecision;
    private extractApiKey;
}
export { Sentinel as default };
//# sourceMappingURL=index.d.ts.map