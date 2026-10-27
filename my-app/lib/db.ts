import mysql, { type ExecuteValues } from 'mysql2/promise'

// A "pool" is a set of reusable MySQL connections. Next.js handles many requests at
// once, and opening a brand new TCP connection to MySQL for every request is slow,
// so we open ~10 up front and borrow one per request.
export const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? 'secret',
  database: process.env.DB_NAME ?? 'auth_learn',

  waitForConnections: true, // if all 10 are busy, queue instead of erroring
  connectionLimit: 10,
})

// Helper so route handlers can just do: const [rows] = await query('SELECT ...', [x])
// The ? placeholders in the SQL are filled in by the driver, which is what protects
// you from SQL injection. NEVER build SQL by string-concatenating user input.
export async function query<T = Record<string, unknown>>(
  sql: string,
  params: ExecuteValues[] = [],
): Promise<T[]> {
  const [rows] = await pool.execute(sql, params)
  return rows as T[]
}
