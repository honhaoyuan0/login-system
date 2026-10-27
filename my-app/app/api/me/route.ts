import { query } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET() {
  // TODO: 1. Read the 'session' cookie.
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value
  //   (in Next 16, cookies() is async — you must await it)

  // TODO: 2. If there is no token -> 401 { error: 'not logged in' }
    if (!token) {
        return Response.json({ error: 'not logged in' }, { status: 401 })
    }
  // TODO: 3. Look up the session and the user it points to, in ONE query.
  //   A JOIN is the natural tool here:
  //     SELECT u.id, u.email
  //     FROM sessions s
  //     JOIN users u ON u.id = s.user_id
  //     WHERE s.token = ?
  //   Then: const [row] = await query(...)
    const [row] = await query<{ id: number; email: string }>(
        'SELECT u.id, u.email FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?', [token]
    )
  // TODO: 4. If no row came back -> 401.
  //   (A cookie can hold a token that was never issued, or one whose row
  //    was deleted. Treat "unknown token" exactly like "no token".

    if (!row) {
        return Response.json({ error: 'not logged in' }, { status: 401 })
    }

  // TODO: 5. Return Response.json({ id: row.id, email: row.email })
    return Response.json({ id: row.id, email: row.email }, { status: 200 })
}
