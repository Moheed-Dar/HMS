'use client'

import { motion } from 'framer-motion'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { Mail, Phone } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="primary" className="mb-6">
            Begin Your Journey
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Prepared to Revolutionize Your{' '}
            <span className="text-gradient">Medical Facility?</span>
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Become part of the growing network of healthcare professionals who rely on MediCare for their daily practice management. Start your journey with a complimentary demonstration today.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button size="lg">
              Enroll Your Practice
            </Button>
            <Button variant="secondary" size="lg">
              Schedule Demo
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="mailto:contact@medicare.com" className="flex items-center gap-2 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              <Mail className="w-4 h-4" />
              contact@medicare.com
            </a>
            <a href="tel:+923063333557" className="flex items-center gap-2 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              <Phone className="w-4 h-4" />
              +92306-333-3557
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}