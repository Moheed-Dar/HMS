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
    title: 'WhatsApp Integration',
    description: 'Send automated health alerts, visit reminders, and payment confirmations directly to patients through WhatsApp.',
    color: 'bg-green-500',
  },
  {
    icon: FileText,
    title: 'Digital Patient Files',
    description: 'Store complete medical histories, treatment records, lab results, and prescriptions in one secure location.',
    color: 'bg-blue-500',
  },
  {
    icon: CreditCard,
    title: 'Online Payment System',
    description: 'Generate invoices with tax compliance, track payments, and accept digital payments seamlessly.',
    color: 'bg-purple-500',
  },
  {
    icon: Calendar,
    title: 'Appointment Manager',
    description: 'Efficiently schedule patient visits, manage doctor timetables, and handle clinic holidays with ease.',
    color: 'bg-orange-500',
  },
  {
    icon: Shield,
    title: 'Data Protection',
    description: 'Secure patient information with encrypted storage, user permissions, and multi-level authentication.',
    color: 'bg-red-500',
  },
  {
    icon: BarChart3,
    title: 'Business Insights',
    description: 'Monitor clinic performance, track financial metrics, and analyze patient patterns with interactive charts.',
    color: 'bg-cyan-500',
  },
  {
    icon: Video,
    title: 'Virtual Consultations',
    description: 'Conduct remote patient visits through integrated video calling platforms for convenient healthcare access.',
    color: 'bg-pink-500',
  },
  {
    icon: ClipboardList,
    title: 'Quick Documentation',
    description: 'Use customizable medical forms and templates to speed up clinical notes and maintain standard procedures.',
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
    <section id="features" className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Powerful Tools"
          title={<span className="text-slate-900 dark:text-slate-100">Complete Solution for</span>}
          highlight={<span className="text-slate-900 dark:text-slate-100">Your Practice</span>}
          description={<span className="text-slate-600 dark:text-slate-400">Advanced features built to streamline healthcare operations and enhance patient experience</span>}
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
              <Card className="h-full cursor-pointer group dark:bg-slate-800/50 dark:border-slate-700">
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
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