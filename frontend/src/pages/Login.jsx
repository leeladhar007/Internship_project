import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiLogin, setToken } from '../api'
import { useAuth } from '../context/AuthContext'
import GradientButton from '../components/GradientButton'

const features = [
  { icon: '🤖', title: 'Smart Solutions', desc: 'AI-powered answers at lightning speed' },
  { icon: '🔒', title: 'Secure Platform', desc: 'Enterprise-grade security for your data' },
  { icon: '⚡', title: 'Fast Performance', desc: 'Sub-second responses, always reliable' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await apiLogin(form.username, form.password)
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.detail || 'Invalid username or password')
        return
      }
      const { access_token } = await res.json()
      login(access_token)
      navigate('/app/about')
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
        <div className="blob absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-300" />
        <div className="blob absolute bottom-0 right-0 w-80 h-80 rounded-full bg-sky-200" />
        <div className="blob absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-emerald-200" />
      </div>

      {/* Left panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex flex-col justify-center w-1/2 px-16 relative z-10"
      >
        <div className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 pastel-gradient rounded-2xl flex items-center justify-center text-white font-bold shadow-glow">
            AG
          </div>
          <div>
            <div className="font-bold text-gray-800 text-lg leading-tight">AppGallop</div>
            <div className="text-xs text-gray-400">Support System</div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-3 leading-tight">
          Intelligent business solutions<br />
          <span className="pastel-gradient-text">at your fingertips</span>
        </h2>
        <p className="text-gray-500 mb-10 text-sm">
          One platform for AI-powered customer support, knowledge management, and team collaboration.
        </p>

        <div className="space-y-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
              className="frosted rounded-2xl p-4 flex items-center gap-4 hover:shadow-glow transition-shadow duration-300"
            >
              <div className="text-2xl">{f.icon}</div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">{f.title}</div>
                <div className="text-xs text-gray-500">{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex-1 flex items-center justify-center px-8 relative z-10"
      >
        <div className="w-full max-w-md">
          <div className="frosted rounded-3xl p-8 shadow-glow">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome to AppGallop</h1>
            <p className="text-sm text-gray-400 mb-8">Sign in to your account</p>

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
                {loading ? 'Signing in…' : 'Sign In'}
              </GradientButton>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="pastel-gradient-text font-semibold hover:opacity-80">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
