'use client'

import { motion } from 'framer-motion'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { MessageCircle, Check, Smartphone } from 'lucide-react'

const features = [
  'Automatic visit reminders',
  'Medication update alerts',
  'Invoice and payment notifications',
  'Personalized message options',
]

export default function WhatsAppSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_#22d3ee_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_#3b82f6_0%,_transparent_50%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge variant="gradient" className="mb-6">
              WhatsApp Messaging Platform
            </Badge>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Engage Patients{' '}
              <span className="text-cyan-400">Through Their Favorite App</span>
            </h2>
            
            <p className="text-slate-300 text-lg mb-8 leading-relaxed">
              Utilize WhatsApp to deliver instant appointment confirmations, medication updates, and financial notifications. Improve patient communication and decrease missed appointments by up to 40%.
            </p>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-slate-200">{feature}</span>
                </motion.li>
              ))}
            </ul>

            <Button variant="primary" size="lg">
              Discover Features
            </Button>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center"
          >
            <div className="relative w-72 h-[500px] bg-slate-800 rounded-[3rem] border-8 border-slate-700 shadow-2xl overflow-hidden">
              {/* Phone Screen */}
              <div className="absolute inset-0 bg-slate-900">
                {/* Status Bar */}
                <div className="h-6 bg-slate-800 flex items-center justify-center">
                  <div className="w-20 h-4 bg-slate-700 rounded-full" />
                </div>
                
                {/* WhatsApp Header */}
                <div className="bg-green-600 px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20" />
                  <div>
                    <div className="text-white font-semibold text-sm">MediCare Clinic</div>
                    <div className="text-green-100 text-xs">online</div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-green-100 rounded-lg rounded-tl-none p-3 max-w-[85%]"
                  >
                    <p className="text-sm text-slate-800">
                     Hello! Your appointment with Dr. Shameem is scheduled for tomorrow at 10:00 AM.
                    </p>
                    <span className="text-xs text-slate-500 mt-1 block">10:30 AM</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-green-100 rounded-lg rounded-tl-none p-3 max-w-[85%]"
                  >
                    <p className="text-sm text-slate-800">
                    Your prescription has been generated. View it in your patient portal.
                    </p>
                    <span className="text-xs text-slate-500 mt-1 block">2:15 PM</span>
                  </motion.div>
                </div>
              </div>

              {/* Floating Notification */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                className="absolute -right-4 top-20 bg-white rounded-xl shadow-xl p-3 flex items-center gap-2"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">New Message</div>
                  <div className="text-sm font-semibold text-slate-900">MediCare</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}