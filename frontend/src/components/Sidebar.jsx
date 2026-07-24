import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// All nav items are available to authenticated users.
// (The backend has no working role column, so no role-gating.)
const navItems = [
  { to: '/app/about',    label: 'About',       icon: '🏢' },
  { to: '/app/upload',   label: 'Upload File',  icon: '📁' },
  { to: '/app/chat',     label: 'Chat',         icon: '💬' },
  { to: '/app/feedback', label: 'Feedback',     icon: '⭐' },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl pastel-gradient flex items-center justify-center text-white font-bold text-sm shadow-glow">
            AG
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm leading-tight">AppGallop</div>
            <div className="text-xs text-gray-400">Support System</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'pastel-gradient text-white shadow-glow'
                  : 'text-gray-600 hover:bg-white/70 hover:text-gray-900'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-gray-200/60">
        <div className="flex items-center gap-3 px-3 py-2 mb-3">
          <div className="w-8 h-8 rounded-full pastel-gradient flex items-center justify-center text-white text-xs font-semibold shadow-glow">
            {(user?.username || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-800 truncate">
              {user?.username}
            </div>
            <div className="text-[10px] text-gray-400 truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-64 frosted border-r border-gray-200/60 min-h-screen">
        <SidebarContent />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 frosted z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}