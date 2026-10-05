import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { MikroORM } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  await app.get(MikroORM).connect();

  const config = app.get(ConfigService);
  await app.listen(config.getOrThrow<number>('PORT'));
}

await bootstrap();
