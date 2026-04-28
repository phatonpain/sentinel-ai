import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const incidentId = uuidv4();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Never expose stack traces in production
    const isDev = process.env.NODE_ENV === 'development';
    const message = exception instanceof HttpException
      ? exception.getResponse()
      : 'Internal server error';

    this.logger.error({
      incidentId,
      status,
      path: request.url,
      method: request.method,
      ip: request.ip,
      error: isDev ? exception : undefined,
    });

    response.status(status).json({
      statusCode: status,
      incidentId,
      message: typeof message === 'string' ? message : (message as Record<string, unknown>)?.message || 'Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
