import { createContext, useContext, useState, useEffect } from 'react'
import { setToken, getToken, parseJwt, apiLogout } from '../api'

const AuthContext = createContext(null)

// Build a user object from the JWT claims (sub = username, email = email)
const userFromToken = (token) => {
  if (!token) return null
  const payload = parseJwt(token)
  if (!payload) return null
  return { username: payload.sub, email: payload.email }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      const u = userFromToken(token)
      // Check token hasn't expired
      const payload = parseJwt(token)
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser(u)
      } else {
        // FIX: expired-token cleanup only cleared the auth token before,
        // leaving a stale chat session id behind. Clear both, same as logout().
        setToken(null)
        localStorage.removeItem('ag_session_id')
      }
    }
    setLoading(false)
  }, [])

  const login = (token) => {
    setToken(token)
    setUser(userFromToken(token))
  }

  const logout = async () => {
    // FIX: this used to only clear local state and never actually called
    // the backend's /auth/logout endpoint. Best-effort call it first -
    // if it fails (network issue, already-expired token) we still want to
    // log the user out locally either way.
    try {
      await apiLogout()
    } catch {
      // ignore - local logout proceeds regardless
    }
    setToken(null)
    setUser(null)
    localStorage.removeItem('ag_session_id')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)