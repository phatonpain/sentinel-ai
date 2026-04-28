import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
export interface AlertEvent {
    type: 'BLOCK' | 'CHALLENGE' | 'ALLOW';
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    incidentId: string;
    threatType: string;
    sourceIp: string;
    path: string;
    timestamp: string;
    message: string;
    tenantId: string;
}
export declare class AlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly authService;
    server: Server;
    private readonly logger;
    constructor(authService: AuthService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleSubscribe(client: Socket, payload: {
        tenantId?: string;
    }): void;
    handlePing(client: Socket): void;
    broadcastAlert(tenantId: string, alert: AlertEvent): void;
}
//# sourceMappingURL=alerts.gateway.d.ts.map