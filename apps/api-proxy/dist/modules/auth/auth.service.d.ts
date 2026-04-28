import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly config;
    private readonly secret;
    constructor(config: ConfigService);
    createToken(payload: Record<string, unknown>): Promise<string>;
    verifyToken(token: string): Promise<Record<string, unknown>>;
}
//# sourceMappingURL=auth.service.d.ts.map