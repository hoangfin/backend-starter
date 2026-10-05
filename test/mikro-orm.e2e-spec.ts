import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/postgresql';
import { AppModule } from './../src/app.module.js';

async function createApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  await app.get(MikroORM).connect();

  return app;
}

describe('MikroORM (e2e)', () => {
  let app: INestApplication;
  let orm: MikroORM;

  beforeAll(async () => {
    app = await createApp();
    orm = app.get(MikroORM);
  });

  afterAll(async () => {
    await app.close();
  });

  it('uses the database started by global setup', () => {
    expect(orm.config.get('clientUrl')).toBe(process.env.DATABASE_URL);
  });

  it('connects to the database', async () => {
    await expect(orm.checkConnection())
      .resolves
      .toMatchObject({ ok: true });
  });

  it('has no pending migrations', async () => {
    await expect(orm.migrator.getPending())
      .resolves
      .toEqual([]);
  });

  it('closes the connection when the app closes', async () => {
    const otherApp = await createApp();
    const otherOrm = otherApp.get(MikroORM);
    expect(await otherOrm.isConnected()).toBe(true);

    await otherApp.close();

    expect(await otherOrm.isConnected()).toBe(false);
  });
});
