import {
  int,
  mysqlEnum,
  mysqlTable,
  uniqueIndex,
  varchar,
  serial,
  text,
  mysqlSchema,
} from "drizzle-orm/mysql-core";

export const mySchema = mysqlSchema("my_schema");

export const users = mySchema.table("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 256 }),
  password: varchar("password", { length: 256 }),
});
