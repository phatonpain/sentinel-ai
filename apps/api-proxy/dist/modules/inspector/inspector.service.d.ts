import { InspectRequestDto } from './dto/inspect-request.dto';
import { InspectResponseDto } from './dto/inspect-response.dto';
import { InspectorEngine } from './inspector.engine';
import { RemediationService } from '../remediation/remediation.service';
import { BillingService } from '../billing/billing.service';
import { AlertsGateway } from '../websocket/alerts.gateway';
export declare class InspectorService {
    private readonly engine;
    private readonly remediationService;
    private readonly billingService;
    private readonly alertsGateway;
    private readonly logger;
    constructor(engine: InspectorEngine, remediationService: RemediationService, billingService: BillingService, alertsGateway: AlertsGateway);
    inspect(dto: InspectRequestDto): Promise<InspectResponseDto>;
    private maskIp;
    private sanitizeHeaders;
    private truncateBody;
}
//# sourceMappingURL=inspector.service.d.ts.map