import { randomUUID } from 'crypto'
import { cookies } from 'next/headers'

// GET /api/oauth/login — step 1: send the user to the identity provider.
export async function GET() {
  // TODO: 1. Make a `state` value: randomUUID()
  //   This is anti-CSRF. You will check it when the user comes back, so that
  //   nobody can trick your app into consuming a code they minted.

  // TODO: 2. Store that state in a cookie named 'oauth_state'.
  //   (await cookies()).set('oauth_state', state, { httpOnly: true, path: '/', maxAge: 600 })
  //   It must survive the round trip to the provider and back.

  // TODO: 3. Build the authorize URL and redirect the browser there.
  //   /api/mock-idp/authorize
  //     ?client_id=…        (from lib/mockIdp)
  //     &redirect_uri=…     (must be URL-ENCODED — use encodeURIComponent)
  //                         point it at http://localhost:3000/api/oauth/callback
  //     &state=…
  //   Redirect with: new Response(null, { status: 302, headers: { Location: url } })

  // For WeCom this URL becomes:
  //   open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=…&agentid=…&redirect_uri=…&state=…
  // Everything else in this file stays identical.
}
