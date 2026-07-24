import { motion } from 'framer-motion'

export default function PageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-12 h-12 rounded-full border-4 border-transparent"
        style={{ borderTopColor: '#A78BFA', borderRightColor: '#38BDF8' }}
      />
    </div>
  )
}