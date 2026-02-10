'use client'

import { motion } from 'framer-motion'
import Badge from './Badge'

export default function SectionHeader({
  badge,
  title,
  highlight,
  description,
  align = 'center',
  dark = false,
}) {
  const alignClasses = {
    center: 'text-center items-center',
    left: 'text-left items-start',
    right: 'text-right items-end',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`flex flex-col max-w-3xl mx-auto mb-16 ${alignClasses[align]}`}
    >
      {badge && (
        <Badge variant={dark ? 'gradient' : 'primary'} className="mb-4">
          {badge}
        </Badge>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
        {title}{' '}
        {highlight && (
          <span className="text-gradient">{highlight}</span>
        )}
      </h2>
      {description && (
        <p className={`text-lg ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          {description}
        </p>
      )}
    </motion.div>
  )
}