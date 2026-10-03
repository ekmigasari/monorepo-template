import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { betterAuthConfig } from "../../config";
import { db } from "../../db";
import * as schema from "../../db/schema";

export const auth = betterAuth({
  appName: "Monorepo Template",
  baseURL: betterAuthConfig.url,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      adminRoles: ["admin"],
      defaultRole: "user",
    }),
  ],
  secret: betterAuthConfig.secret,
  trustedOrigins: betterAuthConfig.trustedOrigins,
});

export type AuthSession = typeof auth.$Infer.Session.session;
export type AuthUser = typeof auth.$Infer.Session.user;
