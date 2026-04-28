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
exports.FingerprintController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../../prisma/prisma.service");
const api_key_guard_1 = require("../../common/api-key.guard");
const tenant_guard_1 = require("../../common/tenant.guard");
const impersonation_guard_1 = require("../../common/impersonation.guard");
let FingerprintController = class FingerprintController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listFingerprints() {
        // For MVP, return from tenant schema (raw query due to multiSchema)
        const fingerprints = await this.prisma.fingerprint.findMany({
            orderBy: { lastSeen: 'desc' },
            take: 100,
        });
        return {
            data: fingerprints.map((fp) => ({
                identityId: fp.identityId,
                anomalyScore: Math.round(fp.anomalyScore * 100),
                lastSeen: fp.lastSeen,
                tags: fp.baseline?.tags || ['behavioral'],
            })),
            meta: { total: fingerprints.length },
        };
    }
};
exports.FingerprintController = FingerprintController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FingerprintController.prototype, "listFingerprints", null);
exports.FingerprintController = FingerprintController = __decorate([
    (0, swagger_1.ApiTags)('Fingerprints'),
    (0, swagger_1.ApiSecurity)('apiKey'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, tenant_guard_1.TenantGuard, impersonation_guard_1.ImpersonationGuard),
    (0, common_1.Controller)('fingerprints'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FingerprintController);
//# sourceMappingURL=fingerprint.controller.js.map