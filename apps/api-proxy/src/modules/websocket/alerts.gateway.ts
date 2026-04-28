import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
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

@WebSocketGateway({
  namespace: '/alerts',
  cors: {
    origin: (origin, callback) => {
      const allowed = [
        process.env.DASHBOARD_URL || 'http://localhost:3000',
        'https://app.sentinel.ai',
      ];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  },
})
export class AlertsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(AlertsGateway.name);

  constructor(private readonly authService: AuthService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token as string | undefined;
      if (!token) {
        this.logger.warn(`WebSocket connection rejected: missing token (client ${client.id})`);
        client.disconnect(true);
        return;
      }

      let payload: Record<string, unknown>;
      try {
        payload = await this.authService.verifyToken(token);
      } catch {
        this.logger.warn(`WebSocket connection rejected: invalid token (client ${client.id})`);
        client.disconnect(true);
        return;
      }

      const tenantId = payload.tenantId as string | undefined;
      if (!tenantId) {
        this.logger.warn(`WebSocket connection rejected: no tenantId in token (client ${client.id})`);
        client.disconnect(true);
        return;
      }

      (client as any).tenantId = tenantId;
      this.logger.log(`WebSocket client connected: ${client.id}, tenant: ${tenantId}`);
    } catch (err) {
      this.logger.error(`WebSocket connection error: ${err}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`WebSocket client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(client: Socket, payload: { tenantId?: string }): void {
    const socketTenantId = (client as any).tenantId as string | undefined;
    const requestedTenantId = payload?.tenantId;

    if (!socketTenantId) {
      client.emit('error', { code: 'AUTH_FAILED', message: 'Not authenticated' });
      return;
    }

    if (requestedTenantId && requestedTenantId !== socketTenantId) {
      this.logger.warn(`Tenant isolation violation: socket ${client.id} tried to subscribe to ${requestedTenantId} but owns ${socketTenantId}`);
      client.emit('error', { code: 'FORBIDDEN', message: 'Cannot subscribe to another tenant' });
      return;
    }

    client.join(`tenant:${socketTenantId}`);
    this.logger.log(`Client ${client.id} subscribed to tenant: ${socketTenantId}`);
    client.emit('subscribed', { tenantId: socketTenantId, timestamp: new Date().toISOString() });
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  broadcastAlert(tenantId: string, alert: AlertEvent): void {
    this.server.to(`tenant:${tenantId}`).emit('alert', {
      ...alert,
      timestamp: alert.timestamp || new Date().toISOString(),
    });
    this.logger.log(`Alert broadcasted to tenant:${tenantId} | ${alert.type} | ${alert.threatType} | ${alert.incidentId}`);
  }
}
