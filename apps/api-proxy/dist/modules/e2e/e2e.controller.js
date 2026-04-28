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
exports.E2EController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const auth_service_1 = require("../auth/auth.service");
let E2EController = class E2EController {
    prisma;
    authService;
    constructor(prisma, authService) {
        this.prisma = prisma;
        this.authService = authService;
    }
    guard() {
        if (process.env.NODE_ENV !== 'test' && process.env.ENABLE_E2E !== 'true') {
            throw new common_1.NotFoundException();
        }
    }
    async setupUser(body) {
        this.guard();
        // 1. Create tenant directly
        const tenant = await this.prisma.tenant.create({
            data: {
                name: body.tenantName,
                plan: body.plan || 'FREE',
                status: 'ACTIVE',
            },
        });
        // 2. Create API key (plain text for test only)
        const plainKey = `sk_e2e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        await this.prisma.apiKey.create({
            data: {
                tenantId: tenant.id,
                keyHash: plainKey,
                scopes: ['read', 'write'],
            },
        });
        // 3. Generate JWT
        const token = await this.authService.createToken({
            userId: `e2e-user-${Date.now()}`,
            tenantId: tenant.id,
            email: body.email,
            role: 'admin',
        });
        return {
            userId: `e2e-user-${Date.now()}`,
            tenantId: tenant.id,
            apiKey: plainKey,
            token,
            email: body.email,
            password: 'TestPassword123!',
        };
    }
    async cleanup(body) {
        this.guard();
        // Delete API keys first
        await this.prisma.apiKey.deleteMany({ where: { tenantId: body.tenantId } });
        // Delete tenant
        await this.prisma.tenant.delete({ where: { id: body.tenantId } }).catch(() => null);
        return { cleaned: true };
    }
};
exports.E2EController = E2EController;
__decorate([
    (0, common_1.Post)('setup-user'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], E2EController.prototype, "setupUser", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], E2EController.prototype, "cleanup", null);
exports.E2EController = E2EController = __decorate([
    (0, common_1.Controller)('v1/e2e'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        auth_service_1.AuthService])
], E2EController);
//# sourceMappingURL=e2e.controller.js.map