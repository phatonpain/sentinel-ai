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
exports.AdminController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../../prisma/prisma.service");
const api_key_guard_1 = require("../../common/api-key.guard");
const impersonation_guard_1 = require("../../common/impersonation.guard");
const uuid_1 = require("uuid");
let AdminController = class AdminController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTenant(body) {
        const tenant = await this.prisma.tenant.create({
            data: {
                name: body.name,
                plan: body.plan || 'FREE',
            },
        });
        return { tenantId: tenant.id, name: tenant.name, plan: tenant.plan };
    }
    async listTenants() {
        const tenants = await this.prisma.tenant.findMany({
            select: { id: true, name: true, plan: true, status: true, createdAt: true },
        });
        return { tenants };
    }
    async createApiKey(tenantId) {
        const key = (0, uuid_1.v4)();
        // In production: hash with bcrypt before storing
        await this.prisma.apiKey.create({
            data: {
                tenantId,
                keyHash: key, // TODO: bcrypt
                scopes: ['read:threats', 'write:rules'],
            },
        });
        return { tenantId, apiKey: key, scopes: ['read:threats', 'write:rules'] };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('tenants'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createTenant", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Get)('tenants'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listTenants", null);
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)('tenants/:tenantId/api-keys'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createApiKey", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiSecurity)('apiKey'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard, impersonation_guard_1.ImpersonationGuard),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map