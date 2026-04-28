import { InspectorService } from './inspector.service';
import { InspectRequestDto } from './dto/inspect-request.dto';
import { InspectResponseDto } from './dto/inspect-response.dto';
export declare class InspectorController {
    private readonly inspectorService;
    constructor(inspectorService: InspectorService);
    inspect(dto: InspectRequestDto): Promise<InspectResponseDto>;
}
//# sourceMappingURL=inspector.controller.d.ts.map