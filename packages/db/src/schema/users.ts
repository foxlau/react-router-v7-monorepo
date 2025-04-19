import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { autoIncrementId, createdAt, updatedAt } from "../helpers";

// Table
export const usersTable = sqliteTable("users", {
  id: autoIncrementId("id"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt,
  updatedAt,
});

// Types
export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
