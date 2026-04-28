declare class RequestContextDto {
    requestId: string;
    timestamp: string;
    method: string;
    path: string;
    query: Record<string, string | string[]>;
    headers: Record<string, string | string[]>;
    body?: unknown;
    sourceIp: string;
    userAgent: string;
    apiKey?: string;
    tenantId?: string;
}
declare class InspectOptionsDto {
    mode?: 'block' | 'monitor' | 'challenge';
    autoRemediate?: boolean;
}
export declare class InspectRequestDto {
    context: RequestContextDto;
    options?: InspectOptionsDto;
}
export {};
//# sourceMappingURL=inspect-request.dto.d.ts.map