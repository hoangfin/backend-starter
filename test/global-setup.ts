import { MikroORM } from '@mikro-orm/postgresql';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import config from '../src/mikro-orm.config.js';

export async function setup() {
  const container = await new PostgreSqlContainer('postgres:18-alpine').start();
  const clientUrl = container.getConnectionUri();

  const orm = await MikroORM.init({ ...config, clientUrl });

  try {
    await orm.migrator.up();
  } finally {
    await orm.close();
  }

  process.env.DATABASE_URL = clientUrl;

  return async () => {
    await container.stop();
  };
}
