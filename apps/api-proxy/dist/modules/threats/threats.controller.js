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
exports.ThreatsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../../prisma/prisma.service");
const api_key_guard_1 = require("../../common/api-key.guard");
const tenant_guard_1 = require("../../common/tenant.guard");
const impersonation_guard_1 = require("../../common/impersonation.guard");
let ThreatsController = class ThreatsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listThreats(req, page = '1', limit = '20', severity) {
        const tenantId = req.headers['x-tenant-id'];
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
        // Isolation enforced by TenantGuard, but we also enforce it in query
        // NOTE: Prisma multiSchema requires schema switching; for MVP we simulate with tenantId field
        const where = { tenantId };
        if (severity)
            where.severity = severity;
        const threats = await this.prisma.$transaction(async (tx) => {
            const data = await tx.threat.findMany({
                where,
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                orderBy: { createdAt: 'desc' },
            });
            const total = await tx.threat.count({ where });
            return { data, total };
        });
        return {
            data: threats.data,
            meta: {
                page: pageNum,
                limit: limitNum,
                total: threats.total,
                totalPages: Math.ceil(threats.total / limitNum),
            },
        };
    }
    async getThreat(req, id) {
        const tenantId = req.headers['x-tenant-id'];
        const threat = await this.prisma.threat.findFirst({
            where: { id, tenantId },
        });
        if (!threat) {
            return { statusCode: 404, message: 'Threat not found' };
        }
        return threat;
    }
};
exports.ThreatsController = ThreatsController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('severity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String]),
    __metadata("design:returntype", Promise)
], ThreatsController.prototype, "listThreats", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ThreatsController.prototype, "getThreat", null);
exports.ThreatsController = ThreatsController = __decorate([
    (0, swagger_1.ApiTags)('Threats'),
    (0, swagger_1.ApiSecurity)('apiKey'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, tenant_guard_1.TenantGuard, impersonation_guard_1.ImpersonationGuard),
    (0, common_1.Controller)('threats'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ThreatsController);
//# sourceMappingURL=threats.controller.js.map