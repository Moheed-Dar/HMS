'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Card({
  children,
  className,
  hover = true,
  glow = false,
  ...props
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, transition: { duration: 0.3 } } : {}}
      className={cn(
        'relative bg-white rounded-2xl p-6 border border-slate-100',
        hover && 'hover:shadow-xl hover:shadow-slate-200/50 transition-shadow duration-300',
        glow && 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-500/20 before:to-blue-500/20 before:rounded-2xl before:blur-xl before:-z-10',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}