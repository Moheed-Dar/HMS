'use client'

import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Complete the quick registration process and enter your practice information.',
  },
  {
    number: '02',
    title: 'Set Up Your Practice',
    description: 'Define your medical specialties, consultation fees, and operational preferences.',
  },
  {
    number: '03',
    title: 'Add Your Staff',
    description: 'Onboard your medical team with appropriate access levels and responsibilities.',
  },
  {
    number: '04',
    title: 'Start Operating',
    description: 'Begin accepting appointments, maintaining records, and processing payments.',
  },
]

export default function Steps() {
  return (
    <section id="steps" className="py-20 lg:py-32 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Quick Setup"
          title={<span className="text-slate-900 dark:text-slate-100">Launch Your Practice in</span>}
          highlight={<span className="text-slate-900 dark:text-slate-100">4 Easy Steps</span>}
          description={<span className="text-slate-600 dark:text-slate-400">From registration to full operation – get your medical practice running online within minutes</span>}
        />

        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl rotate-6 opacity-20 dark:opacity-30" />
                  <div className="relative w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30 dark:shadow-cyan-500/20">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}