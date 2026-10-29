// PRETEND THIS IS WECOM'S SERVER.
//
// Everything here is fake so that the OAuth dance can run on localhost. Real
// providers do the same steps, just with real accounts and HTTPS.
import { randomUUID } from 'crypto'

export const MOCK_CLIENT_ID = 'my-app-client-id'
export const MOCK_CLIENT_SECRET = 'my-app-client-secret'

export const MOCK_USER = {
  userid: 'wecom-user-001',
  name: 'Brandon',
  email: 'brandon@example.com',
}

// code -> who it was issued for. Real providers expire these in ~5 minutes
// and allow exactly ONE exchange (single-use).
export const codes = new Map<string, { userId: string; expiresAt: number }>()

// access_token -> userId
export const accessTokens = new Map<string, string>()

export function issueCode(userId: string): string {
  const code = randomUUID()
  codes.set(code, { userId, expiresAt: Date.now() + 5 * 60_000 })
  return code
}

export function issueAccessToken(userId: string): string {
  const token = randomUUID()
  accessTokens.set(token, userId)
  return token
}
