import { query } from '@/lib/db'

export async function POST(req: Request) {
  // TODO (Stage 1):
  // 1. Parse the JSON body -> { email, password }
  const body = await req.json()
  const email = String(body.email ?? '').trim()
  const password = String(body.password ?? '')
  // 2. INSERT the new user. Password is stored PLAIN TEXT on purpose for now.
  if (!email || !password) {
    return Response.json({ error: 'Email and password are required' }, { status: 400 })
  }
  // 3. Return 201 on success, 409 if the email already exists.
  try {
    await query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password])
  } catch (err) {
    const code = (err as {code?: string}).code
    if (code === 'ER_DUP_ENTRY') {
      return Response.json({ error: 'Email already exists' }, { status: 409 })
    }
    throw err 
  }
  
  // Hint: read the body with `const body = await req.json()`
  // Hint: insert with `query('INSERT INTO users (email, password) VALUES (?, ?)', [...])`
  // Hint: MySQL error code for a duplicate unique key is 'ER_DUP_ENTRY'
  return Response.json({ email }, { status: 201 })
}
