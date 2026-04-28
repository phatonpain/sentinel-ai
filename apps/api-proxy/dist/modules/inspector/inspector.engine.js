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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectorEngine = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const shield_service_1 = require("../shield/shield.service");
const fingerprint_service_1 = require("../fingerprint/fingerprint.service");
const ml_service_1 = require("../ml/ml.service");
const semantic_analyzer_service_1 = require("./semantic-analyzer.service");
const honeypot_service_1 = require("../honeypot/honeypot.service");
const dlp_service_1 = require("../dlp/dlp.service");
const rate_limit_service_1 = require("../rate-limit/rate-limit.service");
let InspectorEngine = class InspectorEngine {
    shieldService;
    fingerprintService;
    mlClient;
    semanticAnalyzer;
    honeypotService;
    dlpService;
    rateLimitService;
    constructor(shieldService, fingerprintService, mlClient, semanticAnalyzer, honeypotService, dlpService, rateLimitService) {
        this.shieldService = shieldService;
        this.fingerprintService = fingerprintService;
        this.mlClient = mlClient;
        this.semanticAnalyzer = semanticAnalyzer;
        this.honeypotService = honeypotService;
        this.dlpService = dlpService;
        this.rateLimitService = rateLimitService;
    }
    async inspect(request) {
        const startTime = performance.now();
        const reasons = [];
        let llmCost = { llmTokensIn: 0, llmTokensOut: 0, llmCostUsd: 0 };
        // === CAMADA 0: HONEYPOT (0ms, insta-block se triggered) ===
        const honeypotStart = performance.now();
        const honeypotResult = this.honeypotService.check(request);
        const honeypotMs = performance.now() - honeypotStart;
        if (honeypotResult.triggered) {
            reasons.push({
                layer: 'HONEYPOT',
                score: 100,
                threatType: 'HONEYPOT_TRIGGER',
                explanation: `Honeypot endpoint accessed: ${honeypotResult.endpoint?.method} ${honeypotResult.endpoint?.path}`,
                confidence: 1.0,
            });
            return this.buildResult('BLOCK', 100, reasons, {
                heuristicMs: 0, fingerprintMs: 0, mlMs: 0, llmMs: 0, dlpMs: 0, honeypotMs, rateLimitMs: 0, totalMs: performance.now() - startTime,
            }, { llmTokensIn: 0, llmTokensOut: 0, llmCostUsd: 0 }, undefined, honeypotResult);
        }
        // === CAMADA 0.5: RATE LIMIT ===
        const rateLimitStart = performance.now();
        const rateLimitResult = await this.rateLimitService.check(request);
        const rateLimitMs = performance.now() - rateLimitStart;
        if (!rateLimitResult.allowed) {
            reasons.push({
                layer: 'RATE_LIMIT',
                score: 85,
                threatType: 'RATE_LIMIT_VIOLATION',
                explanation: `Rate limit exceeded. Retry after ${rateLimitResult.retryAfterMs}ms`,
                confidence: 1.0,
            });
            return this.buildResult('BLOCK', 85, reasons, {
                heuristicMs: 0, fingerprintMs: 0, mlMs: 0, llmMs: 0, dlpMs: 0, honeypotMs, rateLimitMs, totalMs: performance.now() - startTime,
            }, { llmTokensIn: 0, llmTokensOut: 0, llmCostUsd: 0 }, undefined, undefined, rateLimitResult);
        }
        if (rateLimitResult.burstDetected) {
            reasons.push({
                layer: 'RATE_LIMIT',
                score: 40,
                threatType: 'RATE_LIMIT_VIOLATION',
                explanation: 'Burst traffic pattern detected',
                confidence: 0.8,
            });
        }
        // === CAMADA 1: DLP ===
        const dlpStart = performance.now();
        const dlpResult = this.dlpService.analyze(request);
        const dlpMs = performance.now() - dlpStart;
        if (dlpResult.score > 0) {
            reasons.push({
                layer: 'DLP',
                score: dlpResult.score,
                threatType: 'DLP_EXFILTRATION',
                explanation: `DLP: ${dlpResult.matches.length} sensitive data matches (${[...new Set(dlpResult.matches.map((m) => m.category))].join(', ')})`,
                confidence: Math.min(1, dlpResult.score / 100),
            });
        }
        // DLP critical exfiltration → direct block
        if (dlpResult.score >= 90) {
            return this.buildResult('BLOCK', dlpResult.score, reasons, {
                heuristicMs: 0, fingerprintMs: 0, mlMs: 0, llmMs: 0, dlpMs, honeypotMs, rateLimitMs, totalMs: performance.now() - startTime,
            }, { llmTokensIn: 0, llmTokensOut: 0, llmCostUsd: 0 }, dlpResult, undefined, rateLimitResult);
        }
        // === CAMADA 2: HEURÍSTICA (0ms, local, R$0) ===
        const heuristicStart = performance.now();
        const heuristicResult = this.shieldService.analyze(request);
        const heuristicMs = performance.now() - heuristicStart;
        reasons.push({
            layer: 'HEURISTIC',
            score: heuristicResult.score,
            threatType: heuristicResult.threatType,
            explanation: heuristicResult.reasons.join('; '),
            confidence: heuristicResult.confidence,
        });
        // Fast path: score <= 25 AND no behavioral anomaly AND no DLP AND no burst → ALLOW (90% do tráfego, R$0)
        const fpStart = performance.now();
        const behaviorScore = await this.fingerprintService.score(request);
        const fingerprintMs = performance.now() - fpStart;
        if (heuristicResult.score <= 25 && behaviorScore < 30 && dlpResult.score < 30 && !rateLimitResult.burstDetected) {
            await this.fingerprintService.record(request);
            return this.buildResult('ALLOW', heuristicResult.score, reasons, {
                heuristicMs, fingerprintMs, mlMs: 0, llmMs: 0, dlpMs, honeypotMs, rateLimitMs, totalMs: performance.now() - startTime,
            }, { llmTokensIn: 0, llmTokensOut: 0, llmCostUsd: 0 }, dlpResult, undefined, rateLimitResult);
        }
        if (behaviorScore > 0) {
            reasons.push({
                layer: 'FINGERPRINT',
                score: behaviorScore,
                explanation: `Behavioral anomaly: ${behaviorScore.toFixed(1)}% deviation from baseline`,
                confidence: Math.min(1.0, behaviorScore / 100 * 1.5),
            });
        }
        // Direct block: heurística >= 85 → BLOCK imediato, sem custo de IA
        if (heuristicResult.score >= 85) {
            return this.buildResult('BLOCK', heuristicResult.score, reasons, {
                heuristicMs, fingerprintMs: 0, mlMs: 0, llmMs: 0, dlpMs, honeypotMs, rateLimitMs, totalMs: performance.now() - startTime,
            }, { llmTokensIn: 0, llmTokensOut: 0, llmCostUsd: 0 }, dlpResult, undefined, rateLimitResult);
        }
        // === CAMADA 3: ML LOCAL (10ms, FastAPI, R$0) ===
        let mlResult = null;
        let mlMs = 0;
        if (heuristicResult.score > 25 || behaviorScore > 50 || dlpResult.score > 50) {
            const mlStart = performance.now();
            mlResult = await this.mlClient.analyzeRequest(request);
            mlMs = performance.now() - mlStart;
            if (mlResult) {
                reasons.push({
                    layer: 'ML',
                    score: mlResult.anomalyScore * 100,
                    explanation: `ML anomaly score: ${(mlResult.anomalyScore * 100).toFixed(1)}%`,
                    confidence: mlResult.confidence,
                });
            }
        }
        // === CAMADA 4: LLM SEMÂNTICO (50-100ms, OpenAI, $0.002) ===
        let llmResult = null;
        let llmMs = 0;
        const needLLM = heuristicResult.score > 70
            || (mlResult && mlResult.anomalyScore > 0.7)
            || behaviorScore > 80
            || dlpResult.score > 70;
        if (needLLM) {
            const llmStart = performance.now();
            llmResult = await this.semanticAnalyzer.analyze(request);
            llmMs = performance.now() - llmStart;
            llmCost = {
                llmTokensIn: llmResult.tokensUsed,
                llmTokensOut: 0,
                llmCostUsd: (llmResult.tokensUsed / 1000) * 0.0015,
            };
            reasons.push({
                layer: 'LLM',
                score: llmResult.riskScore,
                threatType: llmResult.threatType === 'NONE' ? undefined : llmResult.threatType,
                explanation: llmResult.explanation,
                confidence: llmResult.confidence,
            });
        }
        // === ENSEMBLE: ANTI-DILUTION (MAX, NUNCA MÉDIA) ===
        const scores = [
            heuristicResult.score,
            behaviorScore,
            mlResult ? mlResult.anomalyScore * 100 : 0,
            llmResult ? llmResult.riskScore : 0,
            dlpResult.score,
            rateLimitResult.burstDetected ? 40 : 0,
        ].filter((s) => s > 0);
        const finalScore = Math.max(...scores, 0);
        let verdict;
        if (finalScore >= 80)
            verdict = 'BLOCK';
        else if (finalScore >= 50)
            verdict = 'CHALLENGE';
        else
            verdict = 'ALLOW';
        // Register for future learning
        await this.fingerprintService.record(request);
        return this.buildResult(verdict, finalScore, reasons, {
            heuristicMs: Math.round(heuristicMs * 100) / 100,
            fingerprintMs: Math.round(fingerprintMs * 100) / 100,
            mlMs: Math.round(mlMs * 100) / 100,
            llmMs: Math.round(llmMs * 100) / 100,
            dlpMs: Math.round(dlpMs * 100) / 100,
            honeypotMs: Math.round(honeypotMs * 100) / 100,
            rateLimitMs: Math.round(rateLimitMs * 100) / 100,
            totalMs: Math.round((performance.now() - startTime) * 100) / 100,
        }, llmCost, dlpResult, undefined, rateLimitResult);
    }
    buildResult(verdict, score, reasons, latency, cost, dlp, honeypot, rateLimit) {
        return {
            verdict,
            finalScore: Math.round(score),
            confidence: reasons.length > 0 ? Math.max(...reasons.map((r) => r.confidence)) : 0,
            reasons,
            incidentId: verdict !== 'ALLOW' ? (0, uuid_1.v4)() : undefined,
            latencyBreakdown: latency,
            costBreakdown: cost,
            dlp,
            honeypot,
            rateLimit,
        };
    }
};
exports.InspectorEngine = InspectorEngine;
exports.InspectorEngine = InspectorEngine = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shield_service_1.ShieldService,
        fingerprint_service_1.FingerprintService,
        ml_service_1.MlServiceClient,
        semantic_analyzer_service_1.SemanticAnalyzerService,
        honeypot_service_1.HoneypotService,
        dlp_service_1.DlpService,
        rate_limit_service_1.RateLimitService])
], InspectorEngine);
//# sourceMappingURL=inspector.engine.js.map