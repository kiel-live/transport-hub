import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

export default defineConfig({
  driver: 'pg',
  dbCredentials: { connectionString: databaseUrl },
  verbose: true,
  strict: true,
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  tablesFilter: ['^geography_columns', '^geometry_columns', '^spatial_ref_sys'],
});
