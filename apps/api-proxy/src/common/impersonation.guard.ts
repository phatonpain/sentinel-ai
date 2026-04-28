import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ImpersonationGuard implements CanActivate {
  private readonly forbiddenHeaders = [
    'x-impersonate',
    'x-impersonate-user',
    'x-impersonate-tenant',
    'x-on-behalf-of',
    'x-original-user',
    'x-forwarded-user',
    'x-proxied-identity',
  ];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers || {};

    for (const h of this.forbiddenHeaders) {
      if (headers[h] !== undefined || headers[h.toLowerCase()] !== undefined) {
        throw new ForbiddenException(`Impersonation header detected: ${h}. Request blocked.`);
      }
    }

    return true;
  }
}
