import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const UsersTable = pgTable("users", {
  id: serial("id"),
  username: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }),
});
