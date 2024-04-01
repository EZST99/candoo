import { defineConfig } from 'drizzle-kit'
export default defineConfig({
 schema: "./schema.ts",
  driver: 'mysql2',
  dbCredentials: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || " ",
    database: process.env.DB_NAME || "db_candoo",
  },
  verbose: true,
  strict: true,
})