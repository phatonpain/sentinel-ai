import { IsObject, IsOptional, IsString, IsBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

class RequestContextDto {
  @IsString()
  requestId!: string;

  @IsString()
  timestamp!: string;

  @IsString()
  method!: string;

  @IsString()
  path!: string;

  @IsObject()
  query!: Record<string, string | string[]>;

  @IsObject()
  headers!: Record<string, string | string[]>;

  @IsOptional()
  @IsObject()
  body?: unknown;

  @IsString()
  sourceIp!: string;

  @IsString()
  userAgent!: string;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsString()
  tenantId?: string;
}

class InspectOptionsDto {
  @IsOptional()
  @IsIn(['block', 'monitor', 'challenge'])
  mode?: 'block' | 'monitor' | 'challenge';

  @IsOptional()
  @IsBoolean()
  autoRemediate?: boolean;
}

export class InspectRequestDto {
  @IsObject()
  @Type(() => RequestContextDto)
  context!: RequestContextDto;

  @IsOptional()
  @IsObject()
  @Type(() => InspectOptionsDto)
  options?: InspectOptionsDto;
}
