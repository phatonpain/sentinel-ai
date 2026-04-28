"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TenantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
let TenantService = TenantService_1 = class TenantService {
    logger = new common_1.Logger(TenantService_1.name);
    // private tenants = new Map<string, Tenant>();
    async resolveByApiKey(apiKey) {
        // TODO: query Prisma with key hash
        this.logger.debug(`Resolving tenant for key ${apiKey.substring(0, 8)}...`);
        return null;
    }
    async getSchemaName(tenantId) {
        return `tenant_${tenantId.replace(/-/g, '_')}`;
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = TenantService_1 = __decorate([
    (0, common_1.Injectable)()
], TenantService);
//# sourceMappingURL=tenant.service.js.map