import { motion } from 'framer-motion'

export default function GradientButton({ children, type = 'button', onClick, disabled, className = '' }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`pastel-gradient text-white font-semibold px-6 py-3 rounded-2xl shadow-glow 
        disabled:opacity-60 disabled:cursor-not-allowed transition-opacity ${className}`}
    >
      {children}
    </motion.button>
  )
}