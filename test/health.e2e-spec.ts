import { MikroORM } from '@mikro-orm/postgresql';
import { INestApplication, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('HealthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    await app.init();
    await app.get(MikroORM).connect();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health/live reports ok without checking dependencies', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health/live')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          status: 'ok',
          info: {},
          error: {},
          details: {},
        });
      });
  });

  it('GET /api/v1/health/ready reports the database as up', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health/ready')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          status: 'ok',
          info: { database: { status: 'up' } },
          error: {},
        });
      });
  });

  it('GET /api/v1/health/ready responds 503 once the database is unreachable, while live stays ok', async () => {
    await app.get(MikroORM).close();

    await request(app.getHttpServer())
      .get('/api/v1/health/ready')
      .expect(503)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          status: 'error',
          error: {
            database: { status: 'down', message: 'Not connected to database' },
          },
        });
      });

    await request(app.getHttpServer()).get('/api/v1/health/live').expect(200);
  });
});
