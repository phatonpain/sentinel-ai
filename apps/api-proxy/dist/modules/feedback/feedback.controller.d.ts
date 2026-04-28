import { Request } from 'express';
import { FeedbackService, FeedbackDto } from './feedback.service';
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    submitFeedback(req: Request, incidentId: string, dto: FeedbackDto): Promise<{
        status: string;
        action: string;
    }>;
}
//# sourceMappingURL=feedback.controller.d.ts.map