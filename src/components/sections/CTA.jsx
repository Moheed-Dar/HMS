'use client'

import { motion } from 'framer-motion'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { Mail, Phone } from 'lucide-react'

export default function CTA() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="primary" className="mb-6">
            Get Started Today
          </Badge>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Ready to Transform Your{' '}
            <span className="text-gradient">Practice?</span>
          </h2>
          
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join healthcare providers across India who trust OneCare for their daily operations. Get started today with a free demo.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button size="lg">
              Register Your Clinic
            </Button>
            <Button variant="secondary" size="lg">
              Request Demo
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <a href="mailto:contact@medicare.com" className="flex items-center gap-2 hover:text-cyan-600 transition-colors">
              <Mail className="w-4 h-4" />
              contact@medicare.com
            </a>
            <a href="tel:+923063333557" className="flex items-center gap-2 hover:text-cyan-600 transition-colors">
              <Phone className="w-4 h-4" />
              +92306-333-3557
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}