import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { SecurityHeadersInterceptor } from './common/security-headers.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security hardening
  app.use(helmet({
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
  app.use(compression());

  // Global pipes/filters/interceptors
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SecurityHeadersInterceptor());

  // API versioning
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // CORS
  app.enableCors({
    origin: process.env.DASHBOARD_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Sentinel-Api-Key'],
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Sentinel AI API')
    .setDescription('AI-Native Application Security Platform')
    .setVersion('0.1.0')
    .addApiKey({ type: 'apiKey', name: 'X-Sentinel-Api-Key', in: 'header' }, 'apiKey')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port);
  console.log(`Sentinel AI API Proxy running on http://localhost:${port}`);
}
bootstrap();
