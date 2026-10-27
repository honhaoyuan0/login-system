'use client'

import { useEffect, useState, type FormEvent } from 'react'

export default function LoginPage() {
  // useState returns a [value, rite `email = x` —
  // you call setEmail(x), and React re-renders the component for you.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState<{ id: number; email: string } | null>(null)

  // Runs ONCE when the page first loads (the [] at the end = "no dependencies").
  // This is the missing piece: on a refresh, React state is gone, so we have to
  // ask the server who we are. The browser attaches the session cookie for us.
  useEffect(() => {
    // TODO: useEffect's callback cannot itself be async, so declare an async
    // function in here and call it.
    //
    // Inside it:
    //   1. const res = await fetch('/api/me')   (GET, no body — cookie rides along)
    //   2. if (res.ok) { setUser(await res.json()) }
    //   3. if NOT ok -> do nothing. Leave `user` as null. A 401 here is normal,
    //      it just means "not logged in", so don't setError(...) or you'll show
    //      a red error to every anonymous visitor.
    async function fetchUser() {
        const res = await fetch('/api/me')
        if (res.ok) {
            setUser(await res.json())
        }
    }
    fetchUser()
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault() // stop t-page form submission
    setError('')

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'login failed')
      return
    }

    setUser(data)
  }

  if (user) {
    return (
        <><p>Welcome back, {user.email}</p><button onClick={async () => {
            await fetch('/api/logout', { method: 'POST' })
            setUser(null)
          }}>
          Log out
        </button>
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />
      <button type="submit">Log in</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}