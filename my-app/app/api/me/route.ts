import { cookies } from 'next/headers'
import { verifySession } from '@/lib/jwt'

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value

    if (!token) {
        return Response.json({ error: 'not logged in' }, { status: 401 })
    }
    const payload = await verifySession(token)
    if(!payload) {
        return Response.json({ error: 'not logged in' }, { status: 401 })
    }
    return Response.json({ id: payload.userId, email: payload.email }, { status: 200 })
}
