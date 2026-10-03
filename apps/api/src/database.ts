import { createDatabase } from "@repo/db";
import { appConfig, databaseConfig } from "./config";

const globalForDatabase = globalThis as typeof globalThis & {
  database?: ReturnType<typeof createDatabase>;
};

const database = globalForDatabase.database ?? createDatabase(databaseConfig.url);

if (!appConfig.isProduction) {
  globalForDatabase.database = database;
}

export const { db, pool } = database;
