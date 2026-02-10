'use client'

import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import Button from '../ui/Button'
import { ArrowRight } from 'lucide-react'

const integrations = [
  { name: 'WhatsApp Business', category: 'Messaging', color: 'bg-green-500' },
  { name: 'Google Meet', category: 'Video', color: 'bg-blue-500' },
  { name: 'Zoom', category: 'Video', color: 'bg-blue-600' },
  { name: 'Razorpay', category: 'Payments', color: 'bg-purple-500' },
  { name: 'Email', category: 'Communication', color: 'bg-red-500' },
  { name: 'PDF Generation', category: 'Documents', color: 'bg-orange-500' },
]

export default function Integrations() {
  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Integrations"
          title="Seamlessly"
          highlight="Connected"
          description="Integrate with best-in-class tools to streamline your clinic operations"
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
              <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300">
                <div className={`w-12 h-12 ${integration.color} rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-white font-bold text-lg">
                    {integration.name[0]}
                  </span>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">
                  {integration.name}
                </h3>
                <p className="text-xs text-slate-500">{integration.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-slate-600 mb-4">
            All integrations work out of the box. No complex setup required.
          </p>
          <Button variant="outline" icon={ArrowRight}>
            Request Custom Integration
          </Button>
        </div>
      </div>
    </section>
  )
}