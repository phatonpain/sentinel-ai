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
var HoneypotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HoneypotService = void 0;
const common_1 = require("@nestjs/common");
let HoneypotService = HoneypotService_1 = class HoneypotService {
    logger = new common_1.Logger(HoneypotService_1.name);
    endpoints = new Map();
    constructor() {
        this.deployDefaults();
    }
    check(ctx) {
        const key = `${ctx.method.toUpperCase()}:${ctx.path}`;
        const endpoint = this.endpoints.get(key);
        if (endpoint) {
            this.logger.warn({
                msg: 'HONEYPOT TRIGGERED',
                requestId: ctx.requestId,
                tenantId: ctx.tenantId,
                endpoint: endpoint.path,
                method: endpoint.method,
                ip: ctx.sourceIp,
            });
            return {
                triggered: true,
                endpoint,
                score: 100,
                forensics: {
                    timestamp: ctx.timestamp,
                    sourceIp: ctx.sourceIp,
                    userAgent: ctx.userAgent,
                    headers: ctx.headers,
                },
            };
        }
        return { triggered: false, score: 0, forensics: { timestamp: ctx.timestamp, sourceIp: ctx.sourceIp, userAgent: ctx.userAgent, headers: {} } };
    }
    getEndpoints() {
        return Array.from(this.endpoints.values());
    }
    addEndpoint(ep) {
        const id = `hp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const endpoint = { ...ep, id };
        this.endpoints.set(`${ep.method.toUpperCase()}:${ep.path}`, endpoint);
        this.logger.log(`Deployed honeypot endpoint ${ep.method} ${ep.path}`);
        return endpoint;
    }
    removeEndpoint(method, path) {
        return this.endpoints.delete(`${method.toUpperCase()}:${path}`);
    }
    deployDefaults() {
        const defaults = [
            {
                path: '/admin/login',
                method: 'POST',
                responseStatus: 200,
                responseBody: { success: true, token: 'hp_fake_token_7a3f9e2d' },
                delayMs: 800,
                tags: ['admin', 'login'],
            },
            {
                path: '/api/v1/users',
                method: 'GET',
                responseStatus: 200,
                responseBody: { users: [{ id: 1, email: 'admin@honeypot.local', role: 'admin' }] },
                delayMs: 300,
                tags: ['users', ' enumeration'],
            },
            {
                path: '/.env',
                method: 'GET',
                responseStatus: 200,
                responseBody: { DB_PASSWORD: 'hp_fake_pass_9x2k', AWS_KEY: 'AKIAHONEYPOT00000000' },
                delayMs: 500,
                tags: ['config', 'secrets'],
            },
            {
                path: '/wp-admin',
                method: 'GET',
                responseStatus: 200,
                responseBody: { message: 'WordPress admin panel', version: '6.4.3' },
                delayMs: 600,
                tags: ['wordpress', 'cms'],
            },
            {
                path: '/config.json',
                method: 'GET',
                responseStatus: 200,
                responseBody: { apiKeys: { stripe: 'sk_hp_fake_stripe_12345' }, debug: true },
                delayMs: 400,
                tags: ['config', 'secrets'],
            },
            {
                path: '/actuator/env',
                method: 'GET',
                responseStatus: 200,
                responseBody: { activeProfiles: ['dev'], systemEnvironment: { PATH: '/usr/bin', SECRET: 'hp_spring_secret' } },
                delayMs: 350,
                tags: ['spring', 'actuator'],
            },
            {
                path: '/api/internal/health',
                method: 'GET',
                responseStatus: 200,
                responseBody: { status: 'UP', db: 'connected', metrics: { cpu: 0.12, memory: '512MB' } },
                delayMs: 250,
                tags: ['internal', 'health'],
            },
            {
                path: '/graphql',
                method: 'POST',
                responseStatus: 200,
                responseBody: { data: { __schema: { types: [{ name: 'User', fields: [{ name: 'password' }, { name: 'ssn' }] }] } } },
                delayMs: 450,
                tags: ['graphql', 'introspection'],
            },
        ];
        for (const ep of defaults) {
            this.addEndpoint(ep);
        }
    }
};
exports.HoneypotService = HoneypotService;
exports.HoneypotService = HoneypotService = HoneypotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], HoneypotService);
//# sourceMappingURL=honeypot.service.js.map