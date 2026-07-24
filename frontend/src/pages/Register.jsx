import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiRegister, apiLogin } from '../api'
import { useAuth } from '../context/AuthContext'
import GradientButton from '../components/GradientButton'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  // Backend CreateUserRequest: { name, username, email, password }
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiRegister({
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.detail || 'Registration failed')
        return
      }
      // Auto-login after successful registration
      const loginRes = await apiLogin(form.username, form.password)
      if (loginRes.ok) {
        const { access_token } = await loginRes.json()
        login(access_token)
        navigate('/app/about')
      } else {
        navigate('/login')
      }
    } catch {
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden relative bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB]">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sky-200" />
        <div className="blob absolute bottom-0 left-0 w-80 h-80 rounded-full bg-purple-200" />
        <div className="blob absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-emerald-200" />
      </div>

      {/* Left branding panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-center w-1/2 px-16 relative z-10"
      >
        <div className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 pastel-gradient rounded-2xl flex items-center justify-center text-white font-bold shadow-glow">
            AG
          </div>
          <div>
            <div className="font-bold text-gray-800 text-lg">AppGallop</div>
            <div className="text-xs text-gray-400">Support System</div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Join the future of<br />
          <span className="pastel-gradient-text">AI support</span>
        </h2>
        <p className="text-gray-500 text-sm max-w-xs">
          Create your account and start leveraging AI-powered customer support today.
        </p>
        <div className="mt-10 frosted rounded-2xl p-6 max-w-xs">
          <div className="text-3xl mb-3">🚀</div>
          <div className="font-semibold text-gray-800 mb-1">Get started in seconds</div>
          <div className="text-sm text-gray-500">Full access from day one.</div>
        </div>
      </motion.div>

      {/* Right form panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center px-8 relative z-10"
      >
        <div className="w-full max-w-md">
          <div className="frosted rounded-3xl p-8 shadow-glow">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Create your account</h1>
            <p className="text-sm text-gray-400 mb-8">Join AppGallop Support System</p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🪪</span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={set('name')}
                  required
                  className="w-full pl-9 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                <input
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={set('username')}
                  required
                  className="w-full pl-9 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={set('email')}
                  required
                  className="w-full pl-9 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔑</span>
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={set('password')}
                  required
                  className="w-full pl-9 pr-4 py-3 bg-white/60 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
              </div>

              <GradientButton type="submit" disabled={loading} className="w-full justify-center">
                {loading ? 'Creating account…' : 'Create Account'}
              </GradientButton>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="pastel-gradient-text font-semibold hover:opacity-80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
