"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectorController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const api_key_guard_1 = require("../../common/api-key.guard");
const inspector_service_1 = require("./inspector.service");
const inspect_request_dto_1 = require("./dto/inspect-request.dto");
const inspect_response_dto_1 = require("./dto/inspect-response.dto");
let InspectorController = class InspectorController {
    inspectorService;
    constructor(inspectorService) {
        this.inspectorService = inspectorService;
    }
    async inspect(dto) {
        return this.inspectorService.inspect(dto);
    }
};
exports.InspectorController = InspectorController;
__decorate([
    (0, common_1.Version)('1'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Inspect a request and return security verdict' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inspection completed', type: inspect_response_dto_1.InspectResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Request blocked or invalid API key' }),
    openapi.ApiResponse({ status: 201, type: require("./dto/inspect-response.dto").InspectResponseDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inspect_request_dto_1.InspectRequestDto]),
    __metadata("design:returntype", Promise)
], InspectorController.prototype, "inspect", null);
exports.InspectorController = InspectorController = __decorate([
    (0, swagger_1.ApiTags)('Inspection'),
    (0, swagger_1.ApiSecurity)('apiKey'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Controller)('inspect'),
    __metadata("design:paramtypes", [inspector_service_1.InspectorService])
], InspectorController);
//# sourceMappingURL=inspector.controller.js.map