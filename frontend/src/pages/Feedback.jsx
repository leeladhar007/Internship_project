import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFeedback } from '../api'
import GradientButton from '../components/GradientButton'
import { Link } from 'react-router-dom'

const emojis = [
  { value: 1, emoji: '😞', label: 'Poor' },
  { value: 2, emoji: '😕', label: 'Fair' },
  { value: 3, emoji: '😊', label: 'Good' },
  { value: 4, emoji: '😄', label: 'Great' },
  { value: 5, emoji: '🤩', label: 'Excellent' },
]

export default function Feedback() {
  // FIX: this used to be a plain `const` re-read from localStorage on every
  // render. handleSubmit clears "ag_session_id" right after a successful
  // submit, so on the very next render this became null - and the
  // unconditional `if (!sessionId) return <StartAChatFirst/>` below fired
  // *before* the success screen ever got a chance to show. Capturing it in
  // state means it's read once, at mount, and stays stable for the rest of
  // this component's life regardless of what handleSubmit clears afterward.
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('ag_session_id')
    return stored ? parseInt(stored, 10) : null
  })

  const [rating, setRating] = useState(null)
  const [helpful, setHelpful] = useState(null)   // "yes" | "no"
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) { setError('Please select a star rating.'); return }
    if (!helpful) { setError('Please indicate whether the chat was helpful.'); return }
    if (!sessionId) { setError('No chat session found. Please start a chat first.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await apiFeedback({ session_id: sessionId, rating, helpful, comment })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || data.message || 'Submission failed.')
        return
      }
      setResult(data)
      setSubmitted(true)
      // Clear stored session so the next chat gets a fresh one. Safe now -
      // `sessionId` above is captured state, not re-read from localStorage,
      // so clearing this doesn't affect what's already rendering.
      localStorage.removeItem('ag_session_id')
    } catch {
      setError('Unable to submit feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setRating(null)
    setHelpful(null)
    setComment('')
    setSubmitted(false)
    setError('')
    setResult(null)
  }

  // No session → prompt user to chat first
  if (!sessionId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-20 frosted rounded-3xl p-10 text-center shadow-glow"
      >
        <div className="text-5xl mb-4">💬</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Start a chat first</h2>
        <p className="text-gray-500 text-sm mb-6">
          Feedback is linked to a chat session. Please have a conversation with the AI assistant,
          then come back here to rate your experience.
        </p>
        <Link to="/app/chat">
          <GradientButton>Go to Chat</GradientButton>
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="frosted rounded-3xl p-12 text-center shadow-glow"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="text-6xl mb-6"
            >
              🎉
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank you!</h2>
            {result && (
              <p className="text-xs text-gray-400 mb-2">Feedback #{result.feedback_id}</p>
            )}
            <p className="text-gray-500 mb-8">Your feedback helps us improve AppGallop for everyone.</p>
            <GradientButton onClick={reset}>Submit Another</GradientButton>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="frosted rounded-3xl p-8 shadow-glow"
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">Share Your Feedback</h1>
              <p className="text-sm text-gray-500">
                Rating for Session #{sessionId}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star / emoji rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  How would you rate your experience? <span className="text-red-400">*</span>
                </label>
                <div className="flex justify-between gap-2">
                  {emojis.map(({ value, emoji, label }) => {
                    const active = rating === value
                    return (
                      <motion.button
                        key={value}
                        type="button"
                        whileHover={{ scale: 1.15, y: -4 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(value)}
                        className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-2xl border-2 transition-all duration-200 ${
                          active
                            ? 'border-purple-400 bg-purple-50/80 shadow-glow'
                            : 'border-gray-200 hover:border-purple-200 hover:bg-white/60'
                        }`}
                      >
                        <span className="text-3xl">{emoji}</span>
                        <span className={`text-xs font-medium ${active ? 'pastel-gradient-text' : 'text-gray-400'}`}>
                          {label}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
                {rating && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm pastel-gradient-text font-medium mt-3"
                  >
                    You selected: {emojis.find((e) => e.value === rating)?.label}
                  </motion.p>
                )}
              </div>

              {/* Helpful toggle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Was the AI helpful? <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-3">
                  {[
                    { value: 'yes', emoji: '👍', label: 'Yes, it helped' },
                    { value: 'no',  emoji: '👎', label: 'Not really' },
                  ].map(({ value, emoji, label }) => {
                    const active = helpful === value
                    return (
                      <motion.button
                        key={value}
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setHelpful(value)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 text-sm font-medium transition-all duration-200 ${
                          active
                            ? 'border-purple-400 pastel-gradient text-white shadow-glow'
                            : 'border-gray-200 text-gray-600 hover:border-purple-200 hover:bg-white/60'
                        }`}
                      >
                        <span className="text-lg">{emoji}</span>
                        {label}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional comments <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What worked well? What could be improved?"
                  rows={4}
                  className="w-full bg-white/60 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              <GradientButton type="submit" disabled={loading} className="w-full justify-center">
                {loading ? 'Submitting…' : 'Submit Feedback'}
              </GradientButton>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}