import {
  boolean,
  date,
  int,
  mysqlTable,
  varchar,
} from 'drizzle-orm/mysql-core';

//export const mySchema = mysqlSchema("my_schema");

export const users = mysqlTable('users', {
  user_id: int('user_id').primaryKey().autoincrement(),
  username: varchar('username', { length: 256 }).unique().notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  salt: varchar('salt', { length: 256 }).notNull(),
  session: varchar('session', { length: 256 }).unique(),
});

export const tasks = mysqlTable('tasks', {
  task_id: int('task_id').primaryKey().autoincrement(),
  user_id: int('user_id')
    .references(() => users.user_id)
    .notNull(),
  category_id: int('category_id')
    .references(() => categories.category_id)
    .notNull(),
  taskname: varchar('taskname', { length: 256 }).notNull(),
  due_date: date('due_date').notNull(),
  description: varchar('description', { length: 256 }).default(''),
  importance: int('importance').default(3).notNull(),
  is_done: boolean('is_done').default(false).notNull(),
  completed_at: date('completed_at'),
});

export const categories = mysqlTable('categories', {
  category_id: int('category_id').primaryKey().autoincrement(),
  user_id: int('user_id')
    .references(() => users.user_id)
    .notNull(),
  categoryname: varchar('categoryname', { length: 256 }).notNull(),
  color: varchar('color', { length: 256 }).notNull(),
});
