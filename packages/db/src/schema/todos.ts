import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { autoIncrementId, createdAt, updatedAt } from "../helpers";

// Table
export const todosTable = sqliteTable("todos", {
  id: autoIncrementId("id"),
  title: text("title").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  createdAt,
  updatedAt,
});

// Types
export type SelectTodo = typeof todosTable.$inferSelect;
export type InsertTodo = typeof todosTable.$inferInsert;
