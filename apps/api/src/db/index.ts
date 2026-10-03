import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { appConfig, databaseConfig } from "../config";
import * as schema from "./schema";

const globalForDatabase = globalThis as typeof globalThis & {
  databasePool?: Pool;
};

export const pool =
  globalForDatabase.databasePool ??
  new Pool({
    connectionString: databaseConfig.url,
  });

if (!appConfig.isProduction) {
  globalForDatabase.databasePool = pool;
}

export const db = drizzle({ client: pool, schema });
