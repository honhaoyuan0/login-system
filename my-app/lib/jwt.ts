import { SignJWT, jwtVerify } from 'jose'

// jose wants the key as bytes, not a string, so encode it once at module load.
// Note: this reads process.env at import time. If JWT_SECRET is missing you get
// a confusing signing failure later, so fail loudly here instead.
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set — add it to .env.local')
}
const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export type SessionPayload = {
  userId: number
  email: string
}

export async function signSession(payload: SessionPayload): Promise<string> {
    return await new SignJWT({email: payload.email})
      .setProtectedHeader({alg: 'HS256'})
      .setSubject(String(payload.userId))
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return { userId: Number(payload.sub), email: String(payload.email) }
  } catch {
    return null   // bad signature, expired, or malformed — all the same to us
  }
}
