import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RequestContext } from '@sentinel/shared-types';

export interface MlAnomalyResult {
  anomalyScore: number;
  isAnomaly: boolean;
  confidence: number;
  latencyMs: number;
}

interface CircuitBreakerState {
  failures: number;
  lastFailure: number;
  open: boolean;
}

@Injectable()
export class MlServiceClient {
  private readonly logger = new Logger(MlServiceClient.name);
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly circuit: CircuitBreakerState = {
    failures: 0,
    lastFailure: 0,
    open: false,
  };
  private readonly failureThreshold = 5;
  private readonly resetTimeoutMs = 30_000;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>('ML_SERVICE_URL') || 'http://localhost:8000';
    this.timeoutMs = this.config.get<number>('ML_TIMEOUT_MS') || 2000;
  }

  async analyzeRequest(ctx: RequestContext): Promise<MlAnomalyResult | null> {
    if (this.isCircuitOpen()) {
      this.logger.warn('ML Service circuit breaker OPEN — skipping ML inference');
      return null;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    const start = performance.now();
    try {
      const res = await fetch(`${this.baseUrl}/v1/analyze-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: ctx.body,
          headers: ctx.headers,
          hour: new Date().getHours(),
          dayOfWeek: new Date().getDay(),
          velocity: { lastMinute: 1, errorRate: 0.0 },
          graph: { transitionProb: 0.5 },
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`ML Service returned ${res.status}`);
      }

      const data = await res.json() as Record<string, unknown>;
      this.onSuccess();

      return {
        anomalyScore: data.anomalyScore as number,
        isAnomaly: data.isAnomaly as boolean,
        confidence: data.confidence as number,
        latencyMs: performance.now() - start,
      };
    } catch (err) {
      this.onFailure();
      this.logger.error({ msg: 'ML Service inference failed', err: (err as Error).message });
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  private isCircuitOpen(): boolean {
    if (!this.circuit.open) return false;
    if (Date.now() - this.circuit.lastFailure > this.resetTimeoutMs) {
      this.logger.log('ML Service circuit breaker half-open — retrying');
      this.circuit.open = false;
      this.circuit.failures = 0;
      return false;
    }
    return true;
  }

  private onSuccess(): void {
    this.circuit.failures = 0;
  }

  private onFailure(): void {
    this.circuit.failures++;
    this.circuit.lastFailure = Date.now();
    if (this.circuit.failures >= this.failureThreshold) {
      this.circuit.open = true;
      this.logger.error('ML Service circuit breaker OPENED');
    }
  }
}
