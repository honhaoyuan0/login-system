'use client'

import { useState, type FormEvent } from 'react'

export default function LoginPage() {
  // useState returns a [value, rite `email = x` —
  // you call setEmail(x), and React re-renders the component for you.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState<{ id: number; email: string } | null>(null)

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
    return <p>Welcome back, {user.email}</p>
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