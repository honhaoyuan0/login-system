import { cookies } from 'next/headers'
import { query } from '@/lib/db'
import { signSession } from '@/lib/jwt'

// GET /api/oauth/callback?code=…&state=…
// Step 2: the provider sent the browser back here with a one-time code.
export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const cookieStore = await cookies()

  // TODO: 1. Compare `state` to the 'oauth_state' cookie.
  //   If they differ (or the cookie is missing) -> 400. Do not proceed.
  //   Then clear the oauth_state cookie — it has done its job.

  // TODO: 2. Exchange the code for an access token. Server-to-server:
  //   await fetch('http://localhost:3000/api/mock-idp/token', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ code, client_id: MOCK_CLIENT_ID, client_secret: MOCK_CLIENT_SECRET }),
  //   })
  //   Note this happens on your server, not in the browser — that is why the
  //   client_secret can exist at all.

  // TODO: 3. Fetch the profile:
  //   await fetch('http://localhost:3000/api/mock-idp/userinfo', {
  //     headers: { Authorization: `Bearer ${access_token}` },
  //   })
  //   -> { sub, userid, name, email }

  // TODO: 4. Find or create the LOCAL user. Match on (provider, external id),
  //   never on email:
  //   SELECT id, email FROM users WHERE auth_provider = 'wecom' AND provider_user_id = ?
  //   If no row: INSERT INTO users (email, auth_provider, provider_user_id) VALUES (?, 'wecom', ?)
  //   and then re-select to get the new id. (Creating on first login is called
  //   JIT provisioning.)

  // TODO: 5. Mint YOUR session — exactly what /api/login does:
  //   const token = await signSession({ userId: row.id, email: row.email })
  //   cookieStore.set('session', token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: … })

  // TODO: 6. Redirect the browser to /login
  //   new Response(null, { status: 302, headers: { Location: '/login' } })
  //   From here on the user is logged in through the SAME cookie as password
  //   login. /api/me and logout need no changes at all.
}
