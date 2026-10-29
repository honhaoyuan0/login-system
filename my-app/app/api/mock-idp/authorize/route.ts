import { issueCode, MOCK_CLIENT_ID, MOCK_USER } from '@/lib/mockIdp'

// GET /api/mock-idp/authorize?client_id=…&redirect_uri=…&state=…
// This is the page the user lands on at the identity provider.
export async function GET(req: Request) {
  const url = new URL(req.url)
  const clientId = url.searchParams.get('client_id')
  const redirectUri = url.searchParams.get('redirect_uri')
  const state = url.searchParams.get('state') ?? ''

  if (clientId !== MOCK_CLIENT_ID) {
    return new Response('unknown client_id', { status: 400 })
  }

  // A real provider redirects ONLY to a URL pre-registered by the app.
  // Without this check, an attacker passes redirect_uri=https://evil.com and
  // the provider hands them a valid code. Open redirect = stolen account.
  if (!redirectUri?.startsWith('http://localhost:3000')) {
    return new Response('redirect_uri is not registered', { status: 400 })
  }

  // In real life this is where a login page renders and the user types a
  // password. WeCom shows a QR code here. We skip it and pretend they logged in.
  const code = issueCode(MOCK_USER.userid)

  // Send the browser back to the app with a one-time code.
  const target = new URL(redirectUri)
  target.searchParams.set('code', code)
  target.searchParams.set('state', state)
  return new Response(null, { status: 302, headers: { Location: target.toString() } })
}
