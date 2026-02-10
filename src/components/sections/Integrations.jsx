'use client'

import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import Button from '../ui/Button'
import { ArrowRight } from 'lucide-react'

const integrations = [
  { name: 'WhatsApp & SMS', category: 'Messaging', color: 'bg-green-500' },
  { name: 'Google Meet', category: 'Video', color: 'bg-blue-500' },
  { name: 'Zoom', category: 'Video', color: 'bg-blue-600' },
  { name: 'Bank-Payments', category: 'Payments', color: 'bg-purple-500' },
  { name: 'Email', category: 'Communication', color: 'bg-red-500' },
  { name: 'PDF Generation', category: 'Documents', color: 'bg-orange-500' },
]

export default function Integrations() {
  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Connected Platforms"
          title={<span className="text-slate-900 dark:text-slate-100">Perfectly</span>}
          highlight={<span className="text-slate-900 dark:text-slate-100">Synchronized</span>}
          description={<span className="text-slate-600 dark:text-slate-400">Powerful connections with top-tier services to enhance your medical practice efficiency</span>}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="bg-slate-50 cursor-pointer dark:bg-slate-800 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-700 hover:border-cyan-200 dark:hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                <div className={`w-12 h-12 ${integration.color} rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-white font-bold text-lg">
                    {integration.name[0]}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-200 text-sm mb-1">
                  {integration.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{integration.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Ready-to-use integrations with zero configuration hassle.
          </p>
          <Button variant="outline" icon={ArrowRight}>
            Need a Custom Connection?
          </Button>
        </div>
      </div>
    </section>
  )
}