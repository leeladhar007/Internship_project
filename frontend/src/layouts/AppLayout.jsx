import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import FloatingChatbot from '../components/FloatingChatbot'

const pageLabels = {
  '/app/about': 'About',
  '/app/upload': 'Upload File',
  '/app/chat': 'Chat',
  '/app/feedback': 'Feedback',
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="blob absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-300" />
        <div className="blob absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-sky-300" />
        <div className="blob absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-emerald-200" />
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="frosted sticky top-0 z-30 flex items-center gap-4 px-6 py-4 border-b border-gray-200/60">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/70 transition-colors text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-semibold text-gray-800 text-lg">
            {pageLabels[location.pathname] || 'AppGallop'}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-400">Connected</span>
          </div>
        </header>

        <main className="flex-1 p-6 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <FloatingChatbot />
    </div>
  )
}