
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

// Lazily initialize DB to avoid build-time failures when env vars are missing
let _db: ReturnType<typeof drizzle> | null = null;

function getDbInternal() {
  if (_db) return _db;

  const url = process.env.TURSO_CONNECTION_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error(
      'Database env missing: set TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN'
    );
  }

  const client = createClient({ url, authToken });
  _db = drizzle(client, { schema });
  return _db;
}

// Proxy ensures we only initialize when actually used at runtime
export const db = new Proxy({} as any, {
  get(_target, prop) {
    const instance = getDbInternal() as any;
    return instance[prop];
  },
}) as ReturnType<typeof drizzle>;

export type Database = ReturnType<typeof getDbInternal>;