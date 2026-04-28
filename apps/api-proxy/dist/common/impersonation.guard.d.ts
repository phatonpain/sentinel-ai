import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class ImpersonationGuard implements CanActivate {
    private readonly forbiddenHeaders;
    canActivate(context: ExecutionContext): boolean;
}
//# sourceMappingURL=impersonation.guard.d.ts.map