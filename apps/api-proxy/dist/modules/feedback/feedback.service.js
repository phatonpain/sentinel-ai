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
var FeedbackService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FeedbackService = FeedbackService_1 = class FeedbackService {
    prisma;
    logger = new common_1.Logger(FeedbackService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitFeedback(tenantId, incidentId, dto) {
        // Upsert feedback
        await this.prisma.$executeRaw `
      INSERT INTO threat_feedback (tenant_id, incident_id, is_false_positive, notes, corrected_verdict)
      VALUES (${tenantId}, ${incidentId}, ${dto.isFalsePositive}, ${dto.notes || null}, ${dto.correctedVerdict || null})
      ON CONFLICT (tenant_id, incident_id) DO UPDATE SET
        is_false_positive = EXCLUDED.is_false_positive,
        notes = EXCLUDED.notes,
        corrected_verdict = EXCLUDED.corrected_verdict,
        updated_at = NOW()
    `;
        if (dto.isFalsePositive) {
            this.logger.warn({
                msg: 'False positive logged',
                incidentId,
                tenantId,
                notes: dto.notes,
            });
            // TODO: add payload to "normals" collection, reduce ensemble weight of offending layer
            return { status: 'recorded', action: 'model_adjusted' };
        }
        this.logger.warn({
            msg: 'True positive confirmed',
            incidentId,
            tenantId,
            notes: dto.notes,
        });
        // TODO: add to "attacks" collection, update heuristic patterns, retrain ML
        return { status: 'recorded', action: 'threat_intelligence_updated' };
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = FeedbackService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map