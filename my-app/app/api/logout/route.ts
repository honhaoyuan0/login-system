import { query } from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST() {
  // TODO: 1. Read the 'session' cookie, same as /api/me does.
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  // TODO: 2. If there IS a token, revoke it in the database:
  if (token) {
    await query('DELETE FROM sessions WHERE token = ?', [token])
  }
  //
  //   This is the step that actually ends the session. Skip it and the row
  //   survives — the token stays a valid credential even after the browser
  //   has forgotten it.

  // TODO: 3. Clear the cookie on the way out:
  cookieStore.delete('session')
  //
  //   Order matters: do the DELETE first, then clear the cookie. Think about
  //   which one you would rather fail.

  // TODO: 4. Return 200 unconditionally.
  //   Logging out when you are already logged out is not an error. There is
  //   no such thing as "too logged out". If you return 401 here, the client
  //   has to special-case it for no benefit.
  return Response.json({ message: 'logged out' }, { status: 200 })
}
