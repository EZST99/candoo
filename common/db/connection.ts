import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

async function createConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "db_candoo",
  });

  return drizzle(connection);
}

export default createConnection;
