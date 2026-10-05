import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { MikroORM } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  await app.get(MikroORM).connect();

  const config = app.get(ConfigService);
  await app.listen(config.getOrThrow<number>('PORT'));
}

await bootstrap();
