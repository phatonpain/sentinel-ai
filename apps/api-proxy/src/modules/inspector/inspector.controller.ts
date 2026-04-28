import { Controller, Post, Body, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity, ApiResponse } from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/api-key.guard';
import { InspectorService } from './inspector.service';
import { InspectRequestDto } from './dto/inspect-request.dto';
import { InspectResponseDto } from './dto/inspect-response.dto';

@ApiTags('Inspection')
@ApiSecurity('apiKey')
@UseGuards(ApiKeyGuard)
@Controller('inspect')
export class InspectorController {
  constructor(private readonly inspectorService: InspectorService) {}

  @Version('1')
  @Post()
  @ApiOperation({ summary: 'Inspect a request and return security verdict' })
  @ApiResponse({ status: 200, description: 'Inspection completed', type: InspectResponseDto })
  @ApiResponse({ status: 403, description: 'Request blocked or invalid API key' })
  async inspect(@Body() dto: InspectRequestDto): Promise<InspectResponseDto> {
    return this.inspectorService.inspect(dto);
  }
}
