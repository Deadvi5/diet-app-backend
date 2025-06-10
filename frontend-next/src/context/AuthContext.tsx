'use client'
import { createContext, useState, useEffect, ReactNode } from 'react'

type AuthContextType = {
  token: string | null
  dietistId: number | null
  login: (tok: string) => void
  logout: () => void
}

function parseToken(tok: string): number | null {
  try {
    const segment = tok.split('.')[1]
    const padded = segment.padEnd(segment.length + ((4 - (segment.length % 4)) % 4), '=')
    const payload = JSON.parse(atob(padded.replace(/-/g, '+').replace(/_/g, '/')))
    return payload.dietist_id ?? null
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  dietistId: null,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== 'undefined' ? localStorage.getItem('token') : null
  )
  const [dietistId, setDietistId] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null
    const t = localStorage.getItem('token')
    return t ? parseToken(t) : null
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      setDietistId(parseToken(token))
    } else {
      localStorage.removeItem('token')
      setDietistId(null)
    }
  }, [token])

  const login = (tok: string) => setToken(tok)
  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, dietistId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
