import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

function isLocalDatabaseUrl(url?: string): boolean {
  if (!url) return false;
  return /@(?:localhost|127\.0\.0\.1)(?::\d+)?\//i.test(url);
}

function normalizeProductionDatabaseUrl(): void {
  if ((process.env.NODE_ENV ?? 'development') !== 'production') {
    return;
  }

  const currentUrl = process.env.DATABASE_URL?.trim();
  const fallbackKeys = ['DATABASE_INTERNAL_URL', 'POSTGRES_INTERNAL_URL', 'POSTGRES_URL'];

  if (!currentUrl || isLocalDatabaseUrl(currentUrl)) {
    const replacementKey = fallbackKeys.find((key) => {
      const value = process.env[key]?.trim();
      return Boolean(value && !isLocalDatabaseUrl(value));
    });

    if (replacementKey) {
      process.env.DATABASE_URL = process.env[replacementKey];
      // eslint-disable-next-line no-console
      console.log(`[Bootstrap] Using ${replacementKey} as DATABASE_URL in production.`);
      return;
    }

    // eslint-disable-next-line no-console
    console.error(
      '[Bootstrap] DATABASE_URL is missing or points to localhost in production. ' +
      'Set a non-local PostgreSQL connection string in Render environment variables.',
    );
  }
}

async function bootstrap() {
  normalizeProductionDatabaseUrl();

  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // ── Security ──────────────────────────────────────────────────────────────
  app.use(helmet());
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // ── Global prefix ─────────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── Validation ────────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // strip unknown props
      forbidNonWhitelisted: true,
      transform: true,          // auto-transform to DTO types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ── Serialization ─────────────────────────────────────────────────────────
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // ── Exception filter ──────────────────────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter());

  // ── Logging interceptor ───────────────────────────────────────────────────
  app.useGlobalInterceptors(new LoggingInterceptor());

  // ── Swagger (disabled in production) ──────────────────────────────────────
  if (nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Beleqet API')
      .setDescription(
        'Beleqet Hiring Platform — Jobs Board, Freelance Marketplace, BeleqetSafe Escrow',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication & session management')
      .addTag('users', 'User profile management')
      .addTag('jobs', 'Job listings & search')
      .addTag('applications', 'Job applications & workflow')
      .addTag('freelance', 'Freelance gigs, bids & contracts')
      .addTag('escrow', 'BeleqetSafe escrow & payments')
      .addTag('wallet', 'Freelancer wallet & withdrawals')
      .addTag('notifications', 'Notification management')
      .addTag('analytics', 'Platform analytics')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    logger.log(`Swagger UI → http://localhost:${port}/api/docs`);
  }

  // ── Graceful shutdown ─────────────────────────────────────────────────────
  app.enableShutdownHooks();

  await app.listen(port);
  logger.log(`🚀 Beleqet API running on http://localhost:${port}/api/v1`);
  logger.log(`   Environment: ${nodeEnv}`);
}

bootstrap().catch((err) => {
  const logger = new Logger('Bootstrap');
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  logger.error(`Fatal startup error: ${message}`, stack);
  // Fallback log for environments where Nest logger output is buffered or suppressed.
  // eslint-disable-next-line no-console
  console.error('Fatal startup error details:', err);
  process.exit(1);
});
