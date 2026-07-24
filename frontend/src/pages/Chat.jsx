import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiChat } from '../api'
import GradientButton from '../components/GradientButton'
import { Link } from 'react-router-dom'

const SENTIMENT_STYLE = {
  POSITIVE: { bg: 'bg-emerald-100 text-emerald-700', label: '😊 Positive' },
  NEGATIVE: { bg: 'bg-red-100 text-red-600',     label: '😟 Negative' },
  NEUTRAL:  { bg: 'bg-gray-100 text-gray-500',   label: '😐 Neutral'  },
}

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hello! I'm the AppGallop AI assistant. How can I help you today? 🤖" },
  ])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState(() => {
    const stored = localStorage.getItem('ag_session_id')
    return stored ? parseInt(stored, 10) : null
  })
  const [loading, setLoading] = useState(false)
  // ended = true when the AI responds with intent "END_CHAT"
  const [ended, setEnded] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

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
        const err = await res.json().catch(() => ({}))
        setMessages((m) => [...m, { role: 'bot', text: `⚠️ ${err.detail || 'Something went wrong.'}` }])
        return
      }
      const data = await res.json()
      // data: { session_id, answer, sentiment, intent }
      const newSessionId = data.session_id ?? sessionId
      setSessionId(newSessionId)
      // Persist session_id so the Feedback page can reference it
      localStorage.setItem('ag_session_id', String(newSessionId))

      setMessages((m) => [
        ...m,
        { role: 'bot', text: data.answer, sentiment: data.sentiment, intent: data.intent },
      ])

      // Backend resolves the session automatically when intent = END_CHAT
      if (data.intent === 'END_CHAT') {
        setEnded(true)
      }
    } catch {
      setMessages((m) => [...m, { role: 'bot', text: '⚠️ Unable to reach the server.' }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const restart = () => {
    setMessages([{ role: 'bot', text: 'Hello again! How can I help you? 🤖' }])
    setSessionId(null)
    setEnded(false)
    // FIX: previously left the old session_id sitting in localStorage,
    // which the floating widget and Feedback page would then pick up
    // instead of whatever comes next.
    localStorage.removeItem('ag_session_id')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="frosted rounded-2xl px-5 py-4 mb-4 flex items-center justify-between shadow-glow"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 pastel-gradient rounded-xl flex items-center justify-center text-white shadow-glow">
            🤖
          </div>
          <div>
            <div className="font-semibold text-gray-800 text-sm">AppGallop AI</div>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${ended ? 'bg-gray-300' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="text-xs text-gray-400">{ended ? 'Session resolved' : 'Online'}</span>
              {sessionId && (
                <span className="text-xs text-gray-300 ml-1">· Session #{sessionId}</span>
              )}
            </div>
          </div>
        </div>
        {ended ? (
          <div className="flex items-center gap-2">
            <Link
              to="/app/feedback"
              className="text-sm px-4 py-2 rounded-xl pastel-gradient text-white shadow-glow hover:opacity-90 transition-opacity"
            >
              Leave Feedback
            </Link>
            <GradientButton onClick={restart} className="text-sm py-2 px-4">
              New Chat
            </GradientButton>
          </div>
        ) : (
          <div className="text-xs text-gray-400 bg-white/50 px-3 py-1.5 rounded-xl border border-gray-200">
            {/* FIX: "say goodbye" implied a magic keyword, but intent
                detection is LLM-based, not a fixed trigger word. */}
            I'll wrap up automatically once things are resolved
          </div>
        )}
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16, x: m.role === 'user' ? 16 : -16 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
            >
              {m.role === 'bot' && (
                <div className="w-7 h-7 pastel-gradient rounded-lg flex items-center justify-center text-xs flex-shrink-0 shadow-glow">
                  🤖
                </div>
              )}
              <div className="flex flex-col gap-1 max-w-[72%]">
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'pastel-gradient text-white rounded-br-sm shadow-glow'
                      : 'frosted text-gray-700 rounded-bl-sm border border-gray-200/50'
                  }`}
                >
                  {m.text}
                </div>
                {/* Sentiment badge on bot messages */}
                {m.role === 'bot' && m.sentiment && SENTIMENT_STYLE[m.sentiment.toUpperCase()] && (
                  <span className={`self-start text-[10px] px-2 py-0.5 rounded-full font-medium ${SENTIMENT_STYLE[m.sentiment.toUpperCase()].bg}`}>
                    {SENTIMENT_STYLE[m.sentiment.toUpperCase()].label}
                  </span>
                )}
              </div>
              {m.role === 'user' && (
                <div className="w-7 h-7 pastel-gradient rounded-lg flex items-center justify-center text-xs flex-shrink-0 shadow-glow">
                  👤
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2"
          >
            <div className="w-7 h-7 pastel-gradient rounded-lg flex items-center justify-center text-xs flex-shrink-0 shadow-glow">
              🤖
            </div>
            <div className="frosted border border-gray-200/50 px-4 py-3 rounded-2xl rounded-bl-sm">
              <span className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                    className="w-2 h-2 rounded-full bg-purple-400 inline-block"
                  />
                ))}
              </span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="frosted rounded-2xl p-3 flex gap-3 items-end shadow-glow"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={ended}
          placeholder={ended ? 'Session ended — start a new chat or leave feedback' : 'Ask anything…'}
          rows={1}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none leading-relaxed max-h-32 disabled:opacity-50"
          style={{ overflowY: 'auto' }}
        />
        <motion.button
          whileHover={{ scale: loading || ended ? 1 : 1.08 }}
          whileTap={{ scale: loading || ended ? 1 : 0.92 }}
          onClick={send}
          disabled={loading || ended || !input.trim()}
          className="pastel-gradient text-white text-sm px-4 py-2.5 rounded-xl shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          {loading ? '…' : '➤'}
        </motion.button>
      </motion.div>
    </div>
  )
}