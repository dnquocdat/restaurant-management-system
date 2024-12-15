import { createPool } from 'mysql2/promise.js';

const pool = createPool({
    host: 'localhost', 
    user: 'root',      
    password: '819824',
    database: 'AdvancedDB'
});

export default pool;
