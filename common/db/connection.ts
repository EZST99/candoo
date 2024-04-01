import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

let db: ReturnType<typeof drizzle> | null = null;
async function connectDb() {
  if (db) return db;

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: "",
  });
  db = drizzle(connection);
  return drizzle(connection);
}

export default connectDb;
