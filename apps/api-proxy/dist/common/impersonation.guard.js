"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImpersonationGuard = void 0;
const common_1 = require("@nestjs/common");
let ImpersonationGuard = class ImpersonationGuard {
    forbiddenHeaders = [
        'x-impersonate',
        'x-impersonate-user',
        'x-impersonate-tenant',
        'x-on-behalf-of',
        'x-original-user',
        'x-forwarded-user',
        'x-proxied-identity',
    ];
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const headers = request.headers || {};
        for (const h of this.forbiddenHeaders) {
            if (headers[h] !== undefined || headers[h.toLowerCase()] !== undefined) {
                throw new common_1.ForbiddenException(`Impersonation header detected: ${h}. Request blocked.`);
            }
        }
        return true;
    }
};
exports.ImpersonationGuard = ImpersonationGuard;
exports.ImpersonationGuard = ImpersonationGuard = __decorate([
    (0, common_1.Injectable)()
], ImpersonationGuard);
//# sourceMappingURL=impersonation.guard.js.map