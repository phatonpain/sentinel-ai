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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../../prisma/prisma.service");
const api_key_guard_1 = require("../../common/api-key.guard");
const tenant_guard_1 = require("../../common/tenant.guard");
const impersonation_guard_1 = require("../../common/impersonation.guard");
let MetricsController = class MetricsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMetrics(req) {
        const tenantId = req.headers['x-tenant-id'];
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        // For MVP use raw queries due to multiSchema limitations
        const totalRequests24h = await this.prisma.requestLog.count({
            where: { timestamp: { gte: yesterday } },
        }).catch(() => 0);
        const threatsBlocked24h = await this.prisma.requestLog.count({
            where: { timestamp: { gte: yesterday }, verdict: 'BLOCK' },
        }).catch(() => 0);
        const avgRiskScore = await this.prisma.requestLog.aggregate({
            where: { timestamp: { gte: yesterday } },
            _avg: { riskScore: true },
        }).then((r) => Math.round(r._avg?.riskScore || 0)).catch(() => 0);
        const activeAlerts = await this.prisma.threat.count({
            where: { resolvedAt: null },
        }).catch(() => 0);
        return {
            data: {
                totalRequests24h,
                threatsBlocked24h,
                avgRiskScore,
                activeAlerts,
                tenantId,
            },
        };
    }
};
exports.MetricsController = MetricsController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MetricsController.prototype, "getMetrics", null);
exports.MetricsController = MetricsController = __decorate([
    (0, swagger_1.ApiTags)('Metrics'),
    (0, swagger_1.ApiSecurity)('apiKey'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, tenant_guard_1.TenantGuard, impersonation_guard_1.ImpersonationGuard),
    (0, common_1.Controller)('metrics'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MetricsController);
//# sourceMappingURL=metrics.controller.js.map