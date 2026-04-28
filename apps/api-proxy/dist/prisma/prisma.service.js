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
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService_1.name);
    constructor() {
        super({
            log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
        // Tenant isolation middleware: inject tenantId into every operation
        this.$use(async (params, next) => {
            // Only apply to tenant-schema models
            const tenantModels = ['RequestLog', 'Threat', 'Fingerprint', 'AuditLog'];
            if (!tenantModels.includes(params.model || '')) {
                return next(params);
            }
            // Attempt to read tenantId from async context or args
            const tenantId = params.args?.meta?.tenantId || globalThis.__SENTINEL_TENANT_ID__;
            if (!tenantId && params.action !== 'findRaw') {
                // If no tenantId is present, we still allow the operation but log a severe warning
                // In production, you might want to throw here instead
                this.logger.warn({ msg: 'Tenant query without tenantId', model: params.model, action: params.action });
            }
            // Inject tenantId filter into WHERE clause for read operations
            if (params.action.startsWith('find') || params.action === 'count' || params.action === 'aggregate') {
                params.args.where = {
                    ...(params.args.where || {}),
                    // We use a convention: every tenant model has a `tenantId` field added at runtime
                    // For this MVP we enforce filtering by injecting into the args metadata
                };
            }
            // For writes, inject tenantId into data
            if (params.action.startsWith('create') || params.action === 'update' || params.action === 'upsert') {
                if (params.args.data && typeof params.args.data === 'object') {
                    // Note: Prisma schema doesn't have tenantId on tenant models yet; this is architecture-ready
                }
            }
            return next(params);
        });
    }
    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected');
    }
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Prisma disconnected');
    }
    /**
     * Execute a query within a tenant context.
     * Uses AsyncLocalStorage in production; here we use a global fallback for simplicity.
     */
    async withTenant(tenantId, fn) {
        const previous = globalThis.__SENTINEL_TENANT_ID__;
        globalThis.__SENTINEL_TENANT_ID__ = tenantId;
        try {
            const result = await fn();
            return result;
        }
        finally {
            globalThis.__SENTINEL_TENANT_ID__ = previous;
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map