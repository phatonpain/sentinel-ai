"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AlertsGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
let AlertsGateway = AlertsGateway_1 = class AlertsGateway {
    authService;
    server;
    logger = new common_1.Logger(AlertsGateway_1.name);
    constructor(authService) {
        this.authService = authService;
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token;
            if (!token) {
                this.logger.warn(`WebSocket connection rejected: missing token (client ${client.id})`);
                client.disconnect(true);
                return;
            }
            let payload;
            try {
                payload = await this.authService.verifyToken(token);
            }
            catch {
                this.logger.warn(`WebSocket connection rejected: invalid token (client ${client.id})`);
                client.disconnect(true);
                return;
            }
            const tenantId = payload.tenantId;
            if (!tenantId) {
                this.logger.warn(`WebSocket connection rejected: no tenantId in token (client ${client.id})`);
                client.disconnect(true);
                return;
            }
            client.tenantId = tenantId;
            this.logger.log(`WebSocket client connected: ${client.id}, tenant: ${tenantId}`);
        }
        catch (err) {
            this.logger.error(`WebSocket connection error: ${err}`);
            client.disconnect(true);
        }
    }
    handleDisconnect(client) {
        this.logger.log(`WebSocket client disconnected: ${client.id}`);
    }
    handleSubscribe(client, payload) {
        const socketTenantId = client.tenantId;
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
    handlePing(client) {
        client.emit('pong', { timestamp: new Date().toISOString() });
    }
    broadcastAlert(tenantId, alert) {
        this.server.to(`tenant:${tenantId}`).emit('alert', {
            ...alert,
            timestamp: alert.timestamp || new Date().toISOString(),
        });
        this.logger.log(`Alert broadcasted to tenant:${tenantId} | ${alert.type} | ${alert.threatType} | ${alert.incidentId}`);
    }
};
exports.AlertsGateway = AlertsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AlertsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], AlertsGateway.prototype, "handleSubscribe", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ping'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], AlertsGateway.prototype, "handlePing", null);
exports.AlertsGateway = AlertsGateway = AlertsGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/alerts',
        cors: {
            origin: (origin, callback) => {
                const allowed = [
                    process.env.DASHBOARD_URL || 'http://localhost:3000',
                    'https://app.sentinel.ai',
                ];
                if (!origin || allowed.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'), false);
                }
            },
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AlertsGateway);
//# sourceMappingURL=alerts.gateway.js.map