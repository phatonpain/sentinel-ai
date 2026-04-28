import { ConfigService } from '@nestjs/config';
import type { RequestContext, SecurityDecision, RemediationAction } from '@sentinel/shared-types';
export declare class RemediationService {
    private readonly config;
    private readonly logger;
    private readonly redis;
    private readonly slackWebhook?;
    private readonly pagerdutyKey?;
    constructor(config: ConfigService);
    execute(ctx: RequestContext, decision: SecurityDecision): Promise<RemediationAction[]>;
    private banIp;
    private sendSlack;
    private sendPagerDuty;
}
//# sourceMappingURL=remediation.service.d.ts.map