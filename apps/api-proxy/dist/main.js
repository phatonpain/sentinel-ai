"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/http-exception.filter");
const security_headers_interceptor_1 = require("./common/security-headers.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Security hardening
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
            },
        },
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }));
    app.use((0, compression_1.default)());
    // Global pipes/filters/interceptors
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new security_headers_interceptor_1.SecurityHeadersInterceptor());
    // API versioning
    app.enableVersioning({ type: common_1.VersioningType.URI, defaultVersion: '1' });
    // CORS
    app.enableCors({
        origin: process.env.DASHBOARD_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Sentinel-Api-Key'],
    });
    // Swagger
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Sentinel AI API')
        .setDescription('AI-Native Application Security Platform')
        .setVersion('0.1.0')
        .addApiKey({ type: 'apiKey', name: 'X-Sentinel-Api-Key', in: 'header' }, 'apiKey')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    await app.listen(port);
    console.log(`Sentinel AI API Proxy running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map