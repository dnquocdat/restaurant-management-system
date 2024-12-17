import dotenv from 'dotenv';
dotenv.config();

import { createPool } from 'mysql2/promise.js';

const pool = createPool({
    host: process.env.HOST_DB, 
    user: process.env.USER_DB,      
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE
});

export default pool;
