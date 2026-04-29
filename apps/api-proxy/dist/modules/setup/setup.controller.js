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
exports.SetupController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../../prisma/prisma.service");
const uuid_1 = require("uuid");
let SetupController = class SetupController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async bootstrap(secret, dto) {
        const setupSecret = process.env.SETUP_SECRET;
        if (!setupSecret) {
            throw new common_1.HttpException('SETUP_SECRET not configured', common_1.HttpStatus.FORBIDDEN);
        }
        if (secret !== setupSecret) {
            throw new common_1.HttpException('Invalid setup secret', common_1.HttpStatus.FORBIDDEN);
        }
        const existing = await this.prisma.tenant.findFirst();
        if (existing) {
            throw new common_1.HttpException('Tenant already exists', common_1.HttpStatus.CONFLICT);
        }
        const tenant = await this.prisma.tenant.create({
            data: {
                name: dto.name || 'Default Tenant',
                plan: 'ENTERPRISE',
                status: 'ACTIVE',
            },
        });
        const apiKeyRaw = `sentinel_sk_${Buffer.from((0, uuid_1.v4)()).toString('base64url')}`;
        await this.prisma.apiKey.create({
            data: {
                tenantId: tenant.id,
                keyHash: apiKeyRaw,
                scopes: ['read:threats', 'write:rules', 'admin'],
            },
        });
        return {
            tenantId: tenant.id,
            apiKey: apiKeyRaw,
            name: tenant.name,
            plan: tenant.plan,
            createdAt: tenant.createdAt,
        };
    }
};
exports.SetupController = SetupController;
__decorate([
    (0, common_1.Post)('setup'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Headers)('x-setup-secret')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SetupController.prototype, "bootstrap", null);
exports.SetupController = SetupController = __decorate([
    (0, swagger_1.ApiTags)('Setup'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SetupController);
//# sourceMappingURL=setup.controller.js.map