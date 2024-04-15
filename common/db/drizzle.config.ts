import { defineConfig } from "drizzle-kit";

if (!process.env.DB_HOST) throw new Error("DB_HOST not found");
if (!process.env.DB_USER) throw new Error("DB_USER not found");
if (!process.env.DB_NAME) throw new Error("DB_NAME not found");
if (!process.env.PASS) console.log("DB_PASS not found, using empty password");

export default defineConfig({
  schema: "./common/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.PASS || "",
  },
  verbose: true,
  strict: true,
});
