'use client'

import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'

const steps = [
  {
    number: '01',
    title: 'Register Your Clinic',
    description: 'Sign up in minutes with our simple onboarding. Add your clinic details and logo.',
  },
  {
    number: '02',
    title: 'Configure Services',
    description: 'Set up departments, services, fee rates, and customize your clinic settings.',
  },
  {
    number: '03',
    title: 'Invite Your Team',
    description: 'Add doctors, receptionists, and staff with role-specific access and permissions.',
  },
  {
    number: '04',
    title: 'Go Live',
    description: 'Start scheduling appointments, managing patients, and accepting online payments.',
  },
]

export default function Steps() {
  return (
    <section id="steps" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Getting Started"
          title="Go Live in 4 Simple"
          highlight="Steps"
          description="From signup to managing patients – get your clinic online in minutes"
        />

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200" />

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
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl rotate-6 opacity-20" />
                  <div className="relative w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
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