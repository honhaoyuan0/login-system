import {
  codes,
  issueAccessToken,
  MOCK_CLIENT_ID,
  MOCK_CLIENT_SECRET,
} from '@/lib/mockIdp'

// POST /api/mock-idp/token  { code, client_id, client_secret }
// Server-to-server. The browser never sees this call.
export async function POST(req: Request) {
  // Real providers expect application/x-www-form-urlencoded here; JSON keeps
  // it readable for learning.
  const body = await req.json()

  if (
    body.client_id !== MOCK_CLIENT_ID ||
    body.client_secret !== MOCK_CLIENT_SECRET
  ) {
    return Response.json({ error: 'invalid_client' }, { status: 401 })
  }

  const code = String(body.code ?? '')
  const entry = codes.get(code)
  if (!entry) {
    return Response.json({ error: 'invalid_grant' }, { status: 400 })
  }
  if (Date.now() > entry.expiresAt) {
    codes.delete(code)
    return Response.json({ error: 'invalid_grant' }, { status: 400 })
  }

  codes.delete(code) // single-use: a code may never be exchanged twice

  return Response.json(
    {
      access_token: issueAccessToken(entry.userId),
      token_type: 'Bearer',
      expires_in: 3600,
    },
    { status: 200 },
  )
}
