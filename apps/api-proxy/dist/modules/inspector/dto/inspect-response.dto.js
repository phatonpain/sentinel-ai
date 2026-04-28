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
exports.InspectResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class TimingDto {
    parseMs;
    heuristicMs;
    fingerprintMs;
    mlMs;
    llmMs;
    dlpMs;
    honeypotMs;
    rateLimitMs;
    totalMs;
    static _OPENAPI_METADATA_FACTORY() {
        return { parseMs: { required: true, type: () => Number }, heuristicMs: { required: true, type: () => Number }, fingerprintMs: { required: true, type: () => Number }, mlMs: { required: true, type: () => Number }, llmMs: { required: true, type: () => Number }, dlpMs: { required: true, type: () => Number }, honeypotMs: { required: true, type: () => Number }, rateLimitMs: { required: true, type: () => Number }, totalMs: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TimingDto.prototype, "parseMs", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TimingDto.prototype, "heuristicMs", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TimingDto.prototype, "fingerprintMs", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TimingDto.prototype, "mlMs", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TimingDto.prototype, "llmMs", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TimingDto.prototype, "dlpMs", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TimingDto.prototype, "honeypotMs", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TimingDto.prototype, "rateLimitMs", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TimingDto.prototype, "totalMs", void 0);
class DlpMatchDto {
    ruleId;
    ruleName;
    category;
    severity;
    matchedText;
    position;
    score;
    static _OPENAPI_METADATA_FACTORY() {
        return { ruleId: { required: true, type: () => String }, ruleName: { required: true, type: () => String }, category: { required: true, type: () => String }, severity: { required: true, type: () => String }, matchedText: { required: true, type: () => String }, position: { required: true, type: () => Number }, score: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DlpMatchDto.prototype, "ruleId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DlpMatchDto.prototype, "ruleName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DlpMatchDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DlpMatchDto.prototype, "severity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DlpMatchDto.prototype, "matchedText", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DlpMatchDto.prototype, "position", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DlpMatchDto.prototype, "score", void 0);
class DlpResultDto {
    score;
    matches;
    redactedPayload;
    static _OPENAPI_METADATA_FACTORY() {
        return { score: { required: true, type: () => Number }, matches: { required: true, type: () => [DlpMatchDto] }, redactedPayload: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DlpResultDto.prototype, "score", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], DlpResultDto.prototype, "matches", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DlpResultDto.prototype, "redactedPayload", void 0);
class RateLimitResultDto {
    allowed;
    remaining;
    resetAt;
    limit;
    windowMs;
    retryAfterMs;
    burstDetected;
    static _OPENAPI_METADATA_FACTORY() {
        return { allowed: { required: true, type: () => Boolean }, remaining: { required: true, type: () => Number }, resetAt: { required: true, type: () => Number }, limit: { required: true, type: () => Number }, windowMs: { required: true, type: () => Number }, retryAfterMs: { required: false, type: () => Number }, burstDetected: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RateLimitResultDto.prototype, "allowed", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RateLimitResultDto.prototype, "remaining", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RateLimitResultDto.prototype, "resetAt", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RateLimitResultDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RateLimitResultDto.prototype, "windowMs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RateLimitResultDto.prototype, "retryAfterMs", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RateLimitResultDto.prototype, "burstDetected", void 0);
class ForensicsDto {
    headersSnapshot;
    bodyTruncated;
    timing;
    dlp;
    rateLimit;
    static _OPENAPI_METADATA_FACTORY() {
        return { headersSnapshot: { required: true, type: () => Object }, bodyTruncated: { required: false, type: () => String }, timing: { required: true, type: () => TimingDto }, dlp: { required: false, type: () => DlpResultDto }, rateLimit: { required: false, type: () => RateLimitResultDto } };
    }
}
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ForensicsDto.prototype, "headersSnapshot", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ForensicsDto.prototype, "bodyTruncated", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", TimingDto)
], ForensicsDto.prototype, "timing", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", DlpResultDto)
], ForensicsDto.prototype, "dlp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", RateLimitResultDto)
], ForensicsDto.prototype, "rateLimit", void 0);
class DecisionDto {
    verdict;
    riskScore;
    incidentId;
    threatType;
    confidence;
    reasons;
    latencyMs;
    static _OPENAPI_METADATA_FACTORY() {
        return { verdict: { required: true, type: () => Object }, riskScore: { required: true, type: () => Number }, incidentId: { required: false, type: () => String }, threatType: { required: false, type: () => String }, confidence: { required: true, type: () => Number }, reasons: { required: true, type: () => [String] }, latencyMs: { required: false, type: () => Number } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecisionDto.prototype, "verdict", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DecisionDto.prototype, "riskScore", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecisionDto.prototype, "incidentId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecisionDto.prototype, "threatType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DecisionDto.prototype, "confidence", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], DecisionDto.prototype, "reasons", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DecisionDto.prototype, "latencyMs", void 0);
class InspectResponseDto {
    decision;
    forensics;
    static _OPENAPI_METADATA_FACTORY() {
        return { decision: { required: true, type: () => DecisionDto }, forensics: { required: false, type: () => ForensicsDto } };
    }
}
exports.InspectResponseDto = InspectResponseDto;
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", DecisionDto)
], InspectResponseDto.prototype, "decision", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", ForensicsDto)
], InspectResponseDto.prototype, "forensics", void 0);
//# sourceMappingURL=inspect-response.dto.js.map