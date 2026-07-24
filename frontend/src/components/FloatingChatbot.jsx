import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiChat } from '../api'

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! How can I help you today? 👋' },
  ])
  const [input, setInput] = useState('')
  // FIX: this used to always start as null, even if a session already
  // existed (e.g. started from the full Chat page). Both this widget and
  // Chat.jsx write to the same "ag_session_id" key, so read it here too -
  // otherwise sending a message here silently starts a second, disconnected
  // session and overwrites the one Chat.jsx was using.
  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem('ag_session_id')
    return stored ? parseInt(stored, 10) : null
  })
  const [loading, setLoading] = useState(false)
  const [ended, setEnded] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || loading || ended) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setLoading(true)
    try {
      const res = await apiChat(text, sessionId)
      if (!res.ok) {
        setMessages((m) => [...m, { role: 'bot', text: 'Something went wrong. Please try again.' }])
        return
      }
      const data = await res.json()
      // data: { session_id, answer, sentiment, intent }
      const newSessionId = data.session_id ?? sessionId
      setSessionId(newSessionId)
      localStorage.setItem('ag_session_id', String(newSessionId))

      setMessages((m) => [...m, { role: 'bot', text: data.answer }])

      if (data.intent === 'END_CHAT') {
        setEnded(true)
        setMessages((m) => [
          ...m,
          { role: 'bot', text: '✅ Session resolved. Visit the Feedback page to rate your experience.' },
        ])
      }
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  const resetChat = () => {
    setMessages([{ role: 'bot', text: 'Hi! How can I help you today? 👋' }])
    setSessionId(null)
    setEnded(false)
    // FIX: matches Chat.jsx's restart() - clear the shared key too, so a
    // stale id doesn't linger for the Feedback page or the other chat UI.
    localStorage.removeItem('ag_session_id')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="w-80 h-[440px] frosted rounded-3xl shadow-glow-lg flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="pastel-gradient px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-xs">🤖</div>
                <span className="text-white font-semibold text-sm">AppGallop AI</span>
                {ended && <span className="text-white/70 text-xs ml-1">· Resolved</span>}
              </div>
              <div className="flex items-center gap-2">
                {ended && (
                  <button onClick={resetChat} className="text-white/80 hover:text-white text-xs underline">
                    New chat
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white text-lg leading-none">×</button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'pastel-gradient text-white'
                        : 'frosted text-gray-700 border border-gray-200/50'
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="frosted border border-gray-200/50 px-3 py-2 rounded-2xl">
                    <span className="flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200/60">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  disabled={ended}
                  placeholder={ended ? 'Session ended' : 'Type a message…'}
                  className="flex-1 text-sm bg-white/60 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={send}
                  disabled={loading || ended}
                  className="pastel-gradient text-white text-sm px-3 py-2 rounded-xl shadow-glow disabled:opacity-60"
                >
                  ➤
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 pastel-gradient rounded-full flex items-center justify-center text-2xl shadow-glow-lg relative"
      >
        {open ? '×' : '💬'}
        {!open && (
          <motion.span
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full pastel-gradient"
          />
        )}
      </motion.button>
    </div>
  )
}