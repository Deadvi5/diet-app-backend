'use client'
import { useState, useContext, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import AuthContext from '@/context/AuthContext'

export default function Login() {
  const { login } = useContext(AuthContext)
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: username, Password: password }),
      })
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      login(data.token)
      router.push('/patients')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="card w-96 bg-base-100 shadow">
        <form onSubmit={handleSubmit} className="card-body space-y-4">
          <h1 className="card-title">Login</h1>
          <input
            className="input input-bordered w-full"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input input-bordered w-full"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="alert alert-error py-1 text-sm">{error}</div>}
          <button className="btn btn-primary w-full" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
