'use client'

import { motion } from 'framer-motion'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { ArrowRight, Play, CheckCircle } from 'lucide-react'

const stats = [
  { value: '100%', label: 'Web Based' },
  { value: '24/7', label: 'Assistance' },
  { value: '5+', label: 'Access Levels' },
  { value: 'PMDC', label: 'Certified' },
]

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background - Dark Mode Support */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-white to-blue-50/50 dark:from-cyan-900/20 dark:via-slate-900 dark:to-blue-900/20" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-100/30 to-transparent dark:from-cyan-900/30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="primary" className="mb-6">
              Comprehensive Medical Practice Solution
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
              Smart{' '}
              <span className="text-gradient">Healthcare Management</span>{' '}
              Platform
            </h1>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl leading-relaxed">
              Transform your medical facility with MediCare – an advanced, web-powered HMS built specifically for healthcare providers across Pakistan. Manage schedules, maintain digital health records, simplify invoicing, and engage patients through WhatsApp integration.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" icon={ArrowRight}>
                Book a Free Demo
              </Button>
              <Button variant="secondary" size="lg">
                Sign Up Your Hospital
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/20 border border-slate-200 dark:border-slate-700">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6">
                {/* Mock Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="text-white/60 text-sm">MediCare Dashboard</div>
                </div>
                
                {/* Mock Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Patients', value: '433', color: 'bg-cyan-500' },
                    { label: 'Appointments', value: '89', color: 'bg-green-500' },
                    { label: 'Revenue', value: '$21K', color: 'bg-purple-500' },
                  ].map((card) => (
                    <div key={card.label} className="bg-white/10 dark:bg-slate-800/50 rounded-xl p-4 backdrop-blur">
                      <div className={`w-8 h-8 ${card.color} rounded-lg mb-2`} />
                      <div className="text-2xl font-bold text-white">{card.value}</div>
                      <div className="text-xs text-white/60">{card.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mock Chart */}
                <div className="bg-white/5 dark:bg-slate-800/30 rounded-xl p-4 h-32 flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-300 dark:from-cyan-600 dark:to-cyan-400 rounded-t"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Badge - Dark Mode Support */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 border border-slate-100 dark:border-slate-700"
            >
              <div className="flex items-center gap-2 text-green-500 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold">WhatsApp Ready</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}