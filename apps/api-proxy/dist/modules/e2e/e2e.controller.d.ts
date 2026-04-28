import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
export declare class E2EController {
    private readonly prisma;
    private readonly authService;
    constructor(prisma: PrismaService, authService: AuthService);
    private guard;
    setupUser(body: {
        email: string;
        tenantName: string;
        plan?: string;
    }): Promise<{
        userId: string;
        tenantId: string;
        apiKey: string;
        token: string;
        email: string;
        password: string;
    }>;
    cleanup(body: {
        tenantId: string;
    }): Promise<{
        cleaned: boolean;
    }>;
}
//# sourceMappingURL=e2e.controller.d.ts.map