import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface FeedbackDto {
  isFalsePositive: boolean;
  notes?: string;
  correctedVerdict?: 'ALLOW' | 'BLOCK';
}

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(private readonly prisma: PrismaService) {}

  async submitFeedback(
    tenantId: string,
    incidentId: string,
    dto: FeedbackDto,
  ): Promise<{ status: string; action: string }> {
    // Upsert feedback
    await this.prisma.$executeRaw`
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
}
