import { boolean, foreignKey, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const user = pgTable(
  "User",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("emailVerified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 })
      .notNull()
      .$onUpdate(() => new Date()),
    role: text("role"),
    banned: boolean("banned"),
    banReason: text("banReason"),
    banExpires: timestamp("banExpires", { precision: 3 }),
  },
  (table) => [uniqueIndex("User_email_key").on(table.email)],
);

export const session = pgTable(
  "Session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt", { precision: 3 }).notNull(),
    token: text("token").notNull(),
    createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 })
      .notNull()
      .$onUpdate(() => new Date()),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId").notNull(),
    impersonatedBy: text("impersonatedBy"),
  },
  (table) => [
    uniqueIndex("Session_token_key").on(table.token),
    foreignKey({
      name: "Session_userId_fkey",
      columns: [table.userId],
      foreignColumns: [user.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);

export const account = pgTable(
  "Account",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId").notNull(),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { precision: 3 }),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { precision: 3 }),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt", { precision: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { precision: 3 })
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    foreignKey({
      name: "Account_userId_fkey",
      columns: [table.userId],
      foreignColumns: [user.id],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);

export const verification = pgTable("Verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", { precision: 3 }).notNull(),
  createdAt: timestamp("createdAt", { precision: 3 }).defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3 }).$onUpdate(() => new Date()),
});
