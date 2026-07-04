"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
function isLocalDatabaseUrl(url) {
    if (!url)
        return false;
    return /@(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?\//i.test(url);
}
function normalizeRenderSsl(url) {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes('render.com') && !parsed.searchParams.has('sslmode')) {
            parsed.searchParams.set('sslmode', 'require');
            return parsed.toString();
        }
        return url;
    }
    catch {
        return url;
    }
}
function logDatabaseTarget(url) {
    try {
        const parsed = new URL(url);
        console.log(`[Bootstrap] Database target host=${parsed.hostname} db=${parsed.pathname.replace('/', '')} user=${parsed.username}`);
    }
    catch {
        console.log('[Bootstrap] Database target is set (unable to parse URL for diagnostics).');
    }
}
function normalizeProductionDatabaseUrl() {
    if ((process.env.NODE_ENV ?? 'development') !== 'production') {
        return;
    }
    const currentUrl = process.env.DATABASE_URL?.trim();
    const fallbackKeys = [
        'DATABASE_INTERNAL_URL',
        'DATABASE_PRIVATE_URL',
        'EXTERNAL_DATABASE_URL',
        'POSTGRES_INTERNAL_URL',
        'POSTGRES_URL',
        'POSTGRESQL_URL',
        'DATABASE_URL_EXTERNAL',
    ];
    if (currentUrl && !isLocalDatabaseUrl(currentUrl)) {
        process.env.DATABASE_URL = normalizeRenderSsl(currentUrl);
        logDatabaseTarget(process.env.DATABASE_URL);
        return;
    }
    if (!currentUrl || isLocalDatabaseUrl(currentUrl)) {
        const replacementKey = fallbackKeys.find((key) => {
            const value = process.env[key]?.trim();
            return Boolean(value && !isLocalDatabaseUrl(value));
        });
        if (replacementKey) {
            const replacementValue = process.env[replacementKey];
            if (!replacementValue) {
                throw new Error(`Resolved ${replacementKey} but value was empty.`);
            }
            process.env.DATABASE_URL = normalizeRenderSsl(replacementValue);
            console.log(`[Bootstrap] Using ${replacementKey} as DATABASE_URL in production.`);
            logDatabaseTarget(process.env.DATABASE_URL);
            return;
        }
        throw new Error('DATABASE_URL is missing or points to localhost in production. ' +
            'Set a non-local PostgreSQL connection string in Render environment variables ' +
            '(for example DATABASE_URL or DATABASE_INTERNAL_URL from your cloud database).');
    }
}
async function bootstrap() {
    normalizeProductionDatabaseUrl();
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { rawBody: true });
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PORT', 4000);
    const nodeEnv = configService.get('NODE_ENV', 'development');
    app.use((0, helmet_1.default)());
    app.enableCors({
        origin: configService.get('FRONTEND_URL', 'http://localhost:3000'),
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    if (nodeEnv !== 'production') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('Beleqet API')
            .setDescription('Beleqet Hiring Platform — Jobs Board, Freelance Marketplace, BeleqetSafe Escrow')
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
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
        logger.log(`Swagger UI → http://localhost:${port}/api/docs`);
    }
    app.enableShutdownHooks();
    await app.listen(port);
    logger.log(`🚀 Beleqet API running on http://localhost:${port}/api/v1`);
    logger.log(`   Environment: ${nodeEnv}`);
}
bootstrap().catch((err) => {
    const logger = new common_1.Logger('Bootstrap');
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    logger.error(message, stack);
    process.exit(1);
});
//# sourceMappingURL=main.js.map