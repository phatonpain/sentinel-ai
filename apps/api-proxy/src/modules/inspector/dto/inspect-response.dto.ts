import { IsObject, IsNumber, IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

class TimingDto {
  @IsNumber() parseMs!: number;
  @IsNumber() heuristicMs!: number;
  @IsNumber() fingerprintMs!: number;
  @IsNumber() mlMs!: number;
  @IsNumber() llmMs!: number;
  @IsNumber() dlpMs!: number;
  @IsNumber() honeypotMs!: number;
  @IsNumber() rateLimitMs!: number;
  @IsNumber() totalMs!: number;
}

class DlpMatchDto {
  @IsString() ruleId!: string;
  @IsString() ruleName!: string;
  @IsString() category!: string;
  @IsString() severity!: string;
  @IsString() matchedText!: string;
  @IsNumber() position!: number;
  @IsNumber() score!: number;
}

class DlpResultDto {
  @IsNumber() score!: number;
  @IsArray() matches!: DlpMatchDto[];
  @IsOptional() @IsString() redactedPayload?: string;
}

class RateLimitResultDto {
  @IsBoolean() allowed!: boolean;
  @IsNumber() remaining!: number;
  @IsNumber() resetAt!: number;
  @IsNumber() limit!: number;
  @IsNumber() windowMs!: number;
  @IsOptional() @IsNumber() retryAfterMs?: number;
  @IsOptional() @IsBoolean() burstDetected?: boolean;
}

class ForensicsDto {
  @IsObject() headersSnapshot!: Record<string, string | string[]>;
  @IsOptional() @IsString() bodyTruncated?: string;
  @IsObject() timing!: TimingDto;
  @IsOptional() @IsObject() dlp?: DlpResultDto;
  @IsOptional() @IsObject() rateLimit?: RateLimitResultDto;
}

class DecisionDto {
  @IsString() verdict!: 'ALLOW' | 'BLOCK' | 'CHALLENGE';
  @IsNumber() riskScore!: number;
  @IsOptional() @IsString() incidentId?: string;
  @IsOptional() @IsString() threatType?: string;
  @IsNumber() confidence!: number;
  @IsArray() reasons!: string[];
  @IsOptional() @IsNumber() latencyMs?: number;
}

export class InspectResponseDto {
  @IsObject() decision!: DecisionDto;
  @IsOptional() @IsObject() forensics?: ForensicsDto;
}
