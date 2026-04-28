import { Controller, Post, Param, Body, UseGuards, Version, Req } from '@nestjs/common';
import { ApiTags, ApiSecurity } from '@nestjs/swagger';
import { Request } from 'express';
import { FeedbackService, FeedbackDto } from './feedback.service';
import { ApiKeyGuard } from '../../common/api-key.guard';
import { TenantGuard } from '../../common/tenant.guard';
import { ImpersonationGuard } from '../../common/impersonation.guard';

@ApiTags('Feedback')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard, TenantGuard, ImpersonationGuard)
@Controller('threats')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Version('1')
  @Post(':incidentId/feedback')
  async submitFeedback(
    @Req() req: Request,
    @Param('incidentId') incidentId: string,
    @Body() dto: FeedbackDto,
  ) {
    const tenantId = (req as any).tenantId || req.headers['x-tenant-id'] as string;
    return this.feedbackService.submitFeedback(tenantId, incidentId, dto);
  }
}
