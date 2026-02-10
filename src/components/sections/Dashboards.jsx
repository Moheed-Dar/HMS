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
            'Complete clinic oversight',
            'Medical team administration',
            'Financial analytics dashboard',
            'Schedule monitoring',
            'Payment and tax setup',
            'Practice customization options',
        ],
    },
    {
        icon: Stethoscope,
        title: 'Doctor',
        color: 'from-green-500 to-green-600',
        features: [
            'Patient care workflow',
            'Daily appointment view',
            'Electronic prescription system',
            'Visit history tracking',
            'Clinical documentation tools',
            'Video consultation support',
        ],
    },
    {
        icon: User,
        title: 'Patient',
        color: 'from-cyan-500 to-cyan-600',
        features: [
            'Personal health portal',
            'Digital booking system',
            'Health records access',
            'Medication history',
            'Online payment gateway',
            'Instant message alerts',
        ],
    },
    {
        icon: UserCircle,
        title: 'Receptionist',
        color: 'from-orange-500 to-orange-600',
        features: [
            'Front office management',
            'Schedule coordination',
            'Visit registration process',
            'Invoice and payment handling',
            'New patient onboarding',
            'Daily activity summaries',
        ],
    },
]

export default function Dashboards() {
    return (
        <section id="dashboards" className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    badge="Role-Based Access"
                    title={<span className="text-slate-900 dark:text-slate-100">Tailored Dashboards for Every</span>}
                    highlight={<span className="text-slate-900 dark:text-slate-100">Role</span>}
                    description={<span className="text-slate-600 dark:text-slate-400">Each user gets a personalized experience based on their responsibilities</span>}
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
                            <Card className="
                                h-full 
                                border-l-4 
                                border-l-transparent 
                                hover:border-l-orange-500 
                                dark:hover:border-l-yellow-700
                                transition-all 
                                duration-300 
                                dark:bg-slate-800/50 
                                dark:border-slate-700
                                ">
                    <div className={`w-12 h-12 bg-gradient-to-br ${dashboard.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                                    <dashboard.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-200 mb-4">
                                    {dashboard.title}
                                </h3>
                                <ul className="space-y-3">
                                    {dashboard.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
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