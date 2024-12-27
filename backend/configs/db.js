import dotenv from "dotenv";
dotenv.config();

import { createPool } from "mysql2/promise.js";

const pool = createPool({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE,
});
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Database connected successfully!");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
})();
export default pool;
