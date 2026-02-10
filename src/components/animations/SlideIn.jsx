'use client'

import { motion } from 'framer-motion'

export default function SlideIn({
  children,
  delay = 0,
  duration = 0.5,
  from = 'left',
  className,
}) {
  const fromDirections = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    top: { y: -100, opacity: 0 },
    bottom: { y: 100, opacity: 0 },
  }

  return (
    <motion.div
      initial={fromDirections[from]}
      whileInView={{ x: 0, y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration, delay, type: 'spring', stiffness: 100 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}