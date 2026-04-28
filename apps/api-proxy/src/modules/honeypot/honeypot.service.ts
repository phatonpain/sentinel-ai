import { Injectable, Logger } from '@nestjs/common';
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

@Injectable()
export class HoneypotService {
  private readonly logger = new Logger(HoneypotService.name);
  private readonly endpoints: Map<string, HoneypotEndpoint> = new Map();

  constructor() {
    this.deployDefaults();
  }

  check(ctx: RequestContext): HoneypotResult {
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

  getEndpoints(): HoneypotEndpoint[] {
    return Array.from(this.endpoints.values());
  }

  addEndpoint(ep: Omit<HoneypotEndpoint, 'id'>): HoneypotEndpoint {
    const id = `hp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const endpoint = { ...ep, id };
    this.endpoints.set(`${ep.method.toUpperCase()}:${ep.path}`, endpoint);
    this.logger.log(`Deployed honeypot endpoint ${ep.method} ${ep.path}`);
    return endpoint;
  }

  removeEndpoint(method: string, path: string): boolean {
    return this.endpoints.delete(`${method.toUpperCase()}:${path}`);
  }

  private deployDefaults(): void {
    const defaults: Omit<HoneypotEndpoint, 'id'>[] = [
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
}
