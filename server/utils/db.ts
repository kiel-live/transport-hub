import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from '../database/schema';

export const tables = schema;

export function useDB() {
  const config = useRuntimeConfig();
  if (!config.dbUrl) {
    throw new Error('Missing dbUrl config');
  }
  const db = postgres(config.dbUrl);
  return drizzle(db, { schema });
}

export type Feed = typeof schema.feeds.$inferSelect;
