import { ConfigService } from '@nestjs/config';
import type { RequestContext } from '@sentinel/shared-types';
export interface MlAnomalyResult {
    anomalyScore: number;
    isAnomaly: boolean;
    confidence: number;
    latencyMs: number;
}
export declare class MlServiceClient {
    private readonly config;
    private readonly logger;
    private readonly baseUrl;
    private readonly timeoutMs;
    private readonly circuit;
    private readonly failureThreshold;
    private readonly resetTimeoutMs;
    constructor(config: ConfigService);
    analyzeRequest(ctx: RequestContext): Promise<MlAnomalyResult | null>;
    private isCircuitOpen;
    private onSuccess;
    private onFailure;
}
//# sourceMappingURL=ml.service.d.ts.map