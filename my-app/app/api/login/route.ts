import { query } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  // TODO (Stage 1):
  // 1. Parse the JSON body -> { email, password }
  const body = await req.json()
  const email = String(body.email ?? '').trim()
  const password = String(body.password ?? '')
  // 2. SELECT the row where email = ?
  const [row] = await query<{ id: number; email: string; password: string }>('SELECT id, email, password FROM users WHERE email = ?', [email])
  // 3. If no row -> 401 "invalid credentials"
  if (!row) {
    return Response.json({ error: 'invalid credentials' }, { status: 401 })
  }
    const ok = await bcrypt.compare(password, row.password)
    if (!ok) {
        return Response.json({ error: 'invalid credentials' }, { status: 401 })
    }
  
  // Password passed
  const token = randomUUID()
  await query("INSERT INTO sessions (token, user_id) VALUES (?, ?)", [token, row.id])
  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
  return Response.json({ email: row.email }, { status: 200 })
}
