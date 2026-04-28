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
var MlServiceClient_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MlServiceClient = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let MlServiceClient = MlServiceClient_1 = class MlServiceClient {
    config;
    logger = new common_1.Logger(MlServiceClient_1.name);
    baseUrl;
    timeoutMs;
    circuit = {
        failures: 0,
        lastFailure: 0,
        open: false,
    };
    failureThreshold = 5;
    resetTimeoutMs = 30_000;
    constructor(config) {
        this.config = config;
        this.baseUrl = this.config.get('ML_SERVICE_URL') || 'http://localhost:8000';
        this.timeoutMs = this.config.get('ML_TIMEOUT_MS') || 2000;
    }
    async analyzeRequest(ctx) {
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
            const data = await res.json();
            this.onSuccess();
            return {
                anomalyScore: data.anomalyScore,
                isAnomaly: data.isAnomaly,
                confidence: data.confidence,
                latencyMs: performance.now() - start,
            };
        }
        catch (err) {
            this.onFailure();
            this.logger.error({ msg: 'ML Service inference failed', err: err.message });
            return null;
        }
        finally {
            clearTimeout(timer);
        }
    }
    isCircuitOpen() {
        if (!this.circuit.open)
            return false;
        if (Date.now() - this.circuit.lastFailure > this.resetTimeoutMs) {
            this.logger.log('ML Service circuit breaker half-open — retrying');
            this.circuit.open = false;
            this.circuit.failures = 0;
            return false;
        }
        return true;
    }
    onSuccess() {
        this.circuit.failures = 0;
    }
    onFailure() {
        this.circuit.failures++;
        this.circuit.lastFailure = Date.now();
        if (this.circuit.failures >= this.failureThreshold) {
            this.circuit.open = true;
            this.logger.error('ML Service circuit breaker OPENED');
        }
    }
};
exports.MlServiceClient = MlServiceClient;
exports.MlServiceClient = MlServiceClient = MlServiceClient_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MlServiceClient);
//# sourceMappingURL=ml.service.js.map