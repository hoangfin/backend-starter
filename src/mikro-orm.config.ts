import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';
import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  metadataProvider: ReflectMetadataProvider,
  dynamicImportProvider: (id) => import(id),
  discovery: {
    warnWhenNoEntities: false,
  },
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    snapshot: process.env.NODE_ENV !== 'production',
    snapshotName: '.snapshot-dev-only-postgres-db',
  },
});
