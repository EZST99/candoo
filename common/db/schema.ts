import {
  int,
  mysqlEnum,
  mysqlTable,
  uniqueIndex,
  varchar,
  serial,
  text,
  mysqlSchema,
  date,
} from "drizzle-orm/mysql-core";

export const mySchema = mysqlSchema("my_schema");

export const users = mySchema.table("users", {
  user_id: int("user_id").primaryKey().autoincrement(),
  username: varchar("username", { length: 256 }).unique().notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  session: varchar("session", { length: 256 }).unique(),
});

export const tasks = mySchema.table("tasks", {
  task_id: int("task_id").primaryKey().autoincrement(),
  user_id: int("user_id").references(() => users.user_id),
  taskname: varchar("taskname", { length: 256 }).notNull(),
  category: varchar("category", { length: 256 }).notNull(),
  due_date: date("due_date"),
  description: varchar("description", { length: 256 }).default(""),
  importance: int("importance").default(3),
  urgency: int("urgency").default(3),
});
