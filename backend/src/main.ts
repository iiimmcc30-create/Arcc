import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { listPresentDbEnvKeys } from './database/resolve-database-url';

function startDiagnosticServer(err: unknown) {
  const port = Number(process.env.PORT) || 3001;
  const message = err instanceof Error ? err.message : String(err);
  const present = listPresentDbEnvKeys(process.env);
  const publicDir = join(__dirname, '..', 'public');
  const payload = {
    status: 'boot_error',
    database: 'down',
    error: message,
    dbEnvKeys: present,
    hint: 'Set DATABASE_URL=${{Postgres.DATABASE_URL}} on this Railway service (Variables). Do not set PORT or DB_SSL for the private URL.',
    time: new Date().toISOString(),
  };

  console.error('Fatal bootstrap error — starting diagnostic HTTP server so Railway healthcheck can surface it.');
  console.error(payload);

  const server = createServer((req, res) => {
    const url = req.url || '/';
    if (url.startsWith('/api/health') || url.startsWith('/api/games')) {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(payload));
      return;
    }
    if (url.startsWith('/api')) {
      res.writeHead(503, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(payload));
      return;
    }
    const indexPath = join(publicDir, 'index.html');
    if (existsSync(indexPath) && (req.method === 'GET' || req.method === 'HEAD')) {
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(readFileSync(indexPath));
      return;
    }
    res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8' });
    res.end(`ARC boot error: ${message}`);
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`Diagnostic server listening on http://0.0.0.0:${port}/api/health`);
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const publicDir = join(__dirname, '..', 'public');
  if (existsSync(publicDir)) {
    app.useStaticAssets(publicDir, { index: false });
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET' && req.method !== 'HEAD') return next();
      if (req.path.startsWith('/api')) return next();
      if (req.path.includes('.')) return next();
      return res.sendFile(join(publicDir, 'index.html'));
    });
  }

  // Railway injects PORT — never hardcode it in service variables.
  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`ARC Esports API running on http://0.0.0.0:${port}/api`);
}

bootstrap().catch((err) => {
  startDiagnosticServer(err);
});
