import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../AuthContext'

export default function Login() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: username, Password: password }),
      })
      if (!res.ok) throw new Error('Login failed')
      const data = await res.json()
      login(data.token)
      navigate('/patients')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4 w-64">
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
        {error && <div className="text-red-500">{error}</div>}
        <button className="btn btn-primary w-full" type="submit">Login</button>
      </form>
    </div>
  )
}
