import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";

if (!process.env.DB_HOST) throw new Error("DB_HOST not found");
if (!process.env.DB_USER) throw new Error("DB_USER not found");
if (!process.env.DB_NAME) throw new Error("DB_NAME not found");
if (!process.env.DB_PASS)
  console.log("DB_PASS not found, using empty password");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS || "",
});

const db = drizzle(connection);

export default db;
