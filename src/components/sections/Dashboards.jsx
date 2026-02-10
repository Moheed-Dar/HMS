'use client'

import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import Card from '../ui/Card'
import { Check, UserCog, Stethoscope, User, UserCircle } from 'lucide-react'

const dashboards = [
  {
    icon: UserCog,
    title: 'Clinic Admin',
    color: 'from-blue-500 to-blue-600',
    features: [
      'Complete clinic management',
      'Doctor & staff management',
      'Revenue & financial reports',
      'Appointment oversight',
      'Billing & tax configuration',
      'Custom clinic settings',
    ],
  },
  {
    icon: Stethoscope,
    title: 'Doctor',
    color: 'from-green-500 to-green-600',
    features: [
      'Clinical workflow management',
      'Appointment calendar',
      'Digital prescriptions (Rx)',
      'Patient encounter history',
      'Medical report generation',
      'Google Meet/Zoom integration',
    ],
  },
  {
    icon: User,
    title: 'Patient',
    color: 'from-cyan-500 to-cyan-600',
    features: [
      'Self-service portal',
      'Online appointment booking',
      'Medical records access',
      'Prescription history',
      'Bill payments via Razorpay',
      'WhatsApp notifications',
    ],
  },
  {
    icon: UserCircle,
    title: 'Receptionist',
    color: 'from-orange-500 to-orange-600',
    features: [
      'Front desk operations',
      'Appointment scheduling',
      'Patient check-in/out',
      'Bill generation & payments',
      'Patient registration',
      'Daily reports',
    ],
  },
]

export default function Dashboards() {
  return (
    <section id="dashboards" className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Role-Based Access"
          title="Tailored Dashboards for Every"
          highlight="Role"
          description="Each user gets a personalized experience based on their responsibilities"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboards.map((dashboard, index) => (
            <motion.div
              key={dashboard.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-l-4 border-l-transparent hover:border-l-orange-500 transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-br ${dashboard.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <dashboard.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {dashboard.title}
                </h3>
                <ul className="space-y-3">
                  {dashboard.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}