'use client'
import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import Card from '../ui/Card'
import { 
  MessageCircle, 
  FileText, 
  CreditCard, 
  Calendar, 
  Shield, 
  BarChart3, 
  Video, 
  ClipboardList 
} from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: 'WhatsApp Notifications',
    description: 'Automated appointment reminders, prescription alerts, and billing notifications via WhatsApp Business API.',
    color: 'bg-green-500',
  },
  {
    icon: FileText,
    title: 'Electronic Health Records',
    description: 'Comprehensive digital patient records with encounter history, prescriptions, and medical reports.',
    color: 'bg-blue-500',
  },
  {
    icon: CreditCard,
    title: 'Razorpay Billing',
    description: 'Streamlined invoice generation with GST support, payment tracking, and online payment gateway.',
    color: 'bg-purple-500',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Intelligent appointment booking with doctor availability, holiday management, and session planning.',
    color: 'bg-orange-500',
  },
  {
    icon: Shield,
    title: 'Multi-Tenant Security',
    description: 'Isolated data for each clinic with role-based access control and JWT authentication.',
    color: 'bg-red-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Real-time insights on revenue, appointments, and patient trends with visual reports.',
    color: 'bg-cyan-500',
  },
  {
    icon: Video,
    title: 'Telemedicine Ready',
    description: 'Google Meet and Zoom integration for virtual consultations and remote patient care.',
    color: 'bg-pink-500',
  },
  {
    icon: ClipboardList,
    title: 'Encounter Templates',
    description: 'Pre-built clinical templates for faster documentation and consistent care protocols.',
    color: 'bg-indigo-500',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Features"
          title="Everything Your Clinic"
          highlight="Needs"
          description="Comprehensive tools designed specifically for modern healthcare practices"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full group">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}