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
exports.TenantGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TenantGuard = class TenantGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const tenantId = request.headers['x-tenant-id'];
        const apiKey = request.headers['x-sentinel-api-key'];
        if (!tenantId) {
            throw new common_1.UnauthorizedException('Missing X-Tenant-Id header');
        }
        if (!apiKey) {
            throw new common_1.UnauthorizedException('Missing X-Sentinel-Api-Key header');
        }
        // Verify that the API key belongs to the claimed tenant
        const keyRecord = await this.prisma.apiKey.findFirst({
            where: {
                tenantId,
                revokedAt: null,
            },
        });
        if (!keyRecord) {
            throw new common_1.ForbiddenException('Invalid tenant or API key');
        }
        // MVP: plain text compare. Production: bcrypt.compare(apiKey, keyRecord.keyHash)
        if (apiKey === keyRecord.keyHash) {
            request.tenantId = tenantId;
            return true;
        }
        // Dev bypass: accept the env key as a fallback
        const envKey = process.env.SENTINEL_API_KEY;
        if (envKey && apiKey === envKey) {
            request.tenantId = tenantId;
            return true;
        }
        throw new common_1.ForbiddenException('API key does not match tenant');
    }
};
exports.TenantGuard = TenantGuard;
exports.TenantGuard = TenantGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantGuard);
//# sourceMappingURL=tenant.guard.js.map