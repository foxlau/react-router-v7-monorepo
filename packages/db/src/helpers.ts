import { type SQL, sql } from "drizzle-orm";
import { type AnySQLiteColumn, integer } from "drizzle-orm/sqlite-core";

export function isTuple<T>(array: T[]): array is [T, ...T[]] {
  return array.length > 0;
}

export function lower(column: AnySQLiteColumn): SQL {
  return sql`lower(${column})`;
}

export function autoIncrementId<Name extends string>(name: Name) {
  return integer(name, { mode: "number" }).primaryKey({
    autoIncrement: true,
  });
}

export function timestamp<Name extends string>(name: Name) {
  return integer(name, { mode: "timestamp" });
}

export const createdAt = timestamp("created_at")
  .default(sql`(unixepoch())`)
  .notNull();

export const updatedAt = timestamp("updated_at").$onUpdate(() => new Date());
