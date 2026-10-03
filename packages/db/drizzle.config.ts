import { defineConfig } from "drizzle-kit";
import { databaseUrlSchema } from "@repo/config/database";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: databaseUrlSchema.parse(process.env.DATABASE_URL),
  },
});
