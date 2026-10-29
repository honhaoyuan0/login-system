import { accessTokens, MOCK_USER } from '@/lib/mockIdp'

// GET /api/mock-idp/userinfo   Authorization: Bearer <access_token>
// For WeCom this endpoint is qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo.
export async function GET(req: Request) {
  const header = req.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const userId = accessTokens.get(token)

  if (!userId) {
    return Response.json({ error: 'invalid_token' }, { status: 401 })
  }

  return Response.json({
    sub: userId, // "subject" — the stable identifier for this person
    userid: MOCK_USER.userid,
    name: MOCK_USER.name,
    email: MOCK_USER.email,
  })
}
