import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: "",
});

const db = drizzle(connection);

export default db;
