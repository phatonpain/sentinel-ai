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
exports.InspectRequestDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class RequestContextDto {
    requestId;
    timestamp;
    method;
    path;
    query;
    headers;
    body;
    sourceIp;
    userAgent;
    apiKey;
    tenantId;
    static _OPENAPI_METADATA_FACTORY() {
        return { requestId: { required: true, type: () => String }, timestamp: { required: true, type: () => String }, method: { required: true, type: () => String }, path: { required: true, type: () => String }, query: { required: true, type: () => Object }, headers: { required: true, type: () => Object }, body: { required: false, type: () => Object }, sourceIp: { required: true, type: () => String }, userAgent: { required: true, type: () => String }, apiKey: { required: false, type: () => String }, tenantId: { required: false, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestContextDto.prototype, "requestId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestContextDto.prototype, "timestamp", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestContextDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestContextDto.prototype, "path", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RequestContextDto.prototype, "query", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RequestContextDto.prototype, "headers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], RequestContextDto.prototype, "body", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestContextDto.prototype, "sourceIp", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestContextDto.prototype, "userAgent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestContextDto.prototype, "apiKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestContextDto.prototype, "tenantId", void 0);
class InspectOptionsDto {
    mode;
    autoRemediate;
    static _OPENAPI_METADATA_FACTORY() {
        return { mode: { required: false, type: () => Object, enum: ['block', 'monitor', 'challenge'] }, autoRemediate: { required: false, type: () => Boolean } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['block', 'monitor', 'challenge']),
    __metadata("design:type", String)
], InspectOptionsDto.prototype, "mode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], InspectOptionsDto.prototype, "autoRemediate", void 0);
class InspectRequestDto {
    context;
    options;
    static _OPENAPI_METADATA_FACTORY() {
        return { context: { required: true, type: () => RequestContextDto }, options: { required: false, type: () => InspectOptionsDto } };
    }
}
exports.InspectRequestDto = InspectRequestDto;
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_transformer_1.Type)(() => RequestContextDto),
    __metadata("design:type", RequestContextDto)
], InspectRequestDto.prototype, "context", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_transformer_1.Type)(() => InspectOptionsDto),
    __metadata("design:type", InspectOptionsDto)
], InspectRequestDto.prototype, "options", void 0);
//# sourceMappingURL=inspect-request.dto.js.map