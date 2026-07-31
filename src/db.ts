import pg from 'pg';
import { config } from './config.js';
const { Pool } = pg;
export const db = new Pool({ connectionString: config.DATABASE_URL, ssl: config.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false } });
export async function one<T>(sql: string, params: unknown[] = []): Promise<T | null> { const r = await db.query(sql, params); return (r.rows[0] as T) ?? null; }
export async function many<T>(sql: string, params: unknown[] = []): Promise<T[]> { return (await db.query(sql, params)).rows as T[]; }
