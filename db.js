import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '@/drizzle/schema';

let pool;
if (process.env.DATABASE_URL) {
  pool = mysql.createPool(process.env.DATABASE_URL);
} else {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'web_cafe_eric',
    waitForConnections: true,
    connectionLimit: 10,
  });
}

export const db = drizzle(pool, { schema, mode: 'default' });
export default pool;
