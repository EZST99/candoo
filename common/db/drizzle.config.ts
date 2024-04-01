import { defineConfig } from 'drizzle-kit'
console.log("DB_HOST", process.env.DB_HOST)
export default defineConfig({
 schema: "./common/db/schema.ts",
  driver: 'mysql2',
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: "",
    database: process.env.DB_NAME || "db_candoo",
  },
  verbose: true,
  strict: true,
})