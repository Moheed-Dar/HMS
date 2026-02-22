'use client'

import { motion } from 'framer-motion'
import { 
  Heart, 
  Shield, 
  Zap, 
  Users, 
  Award, 
  Globe, 
  Target, 
  TrendingUp,
  Linkedin, 
  Twitter,
  ArrowRight,
  Activity,
  Stethoscope,
  Calendar,
  MessageCircle,
  CheckCircle2,
  Building2,
  Phone,
  Brain,
  Lock,
  Handshake,
  Star,
  Sparkles,
  Rocket,
  Clock,
  MapPin
} from 'lucide-react'

const stats = [
  { number: '10K+', label: 'Active Patients', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { number: '500+', label: 'Healthcare Providers', icon: Stethoscope, color: 'from-emerald-500 to-teal-500' },
  { number: '50+', label: 'Cities Covered', icon: MapPin, color: 'from-violet-500 to-purple-500' },
  { number: '99.9%', label: 'Uptime Guaranteed', icon: Clock, color: 'from-amber-500 to-orange-500' },
]

const values = [
  {
    icon: Heart,
    title: 'Patient-Centered Care',
    description: 'Every decision puts patient health first. We build tools that enhance care quality and accessibility.',
    gradient: 'from-rose-400 via-pink-500 to-rose-600',
    bgGradient: 'from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption with HIPAA, GDPR, and SOC 2 compliance. Your data is fortress-protected.',
    gradient: 'from-blue-400 via-cyan-500 to-blue-600',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
  },
  {
    icon: Brain,
    title: 'AI-Powered Innovation',
    description: 'Machine learning diagnostics and predictive analytics that save time and improve outcomes.',
    gradient: 'from-amber-400 via-orange-500 to-amber-600',
    bgGradient: 'from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
  },
  {
    icon: Handshake,
    title: 'Seamless Collaboration',
    description: 'Real-time coordination between patients, doctors, and staff with instant communication tools.',
    gradient: 'from-emerald-400 via-green-500 to-emerald-600',
    bgGradient: 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
  },
  {
    icon: Star,
    title: 'Award-Winning Excellence',
    description: 'Recognized by HealthTech 2024. 4.9/5 rating with 98% customer retention rate.',
    gradient: 'from-violet-400 via-purple-500 to-violet-600',
    bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
  },
  {
    icon: Globe,
    title: 'Global Accessibility',
    description: 'Multi-language support with WCAG 2.1 AAA compliance. Healthcare without boundaries.',
    gradient: 'from-cyan-400 via-teal-500 to-cyan-600',
    bgGradient: 'from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20',
  },
]

const team = [
  { 
    name: 'Dr. Sarah Johnson', 
    role: 'Chief Medical Officer', 
    initials: 'SJ',
    gradient: 'from-rose-400 via-pink-500 to-rose-600',
    specialty: 'Cardiology',
    exp: '15+ yrs'
  },
  { 
    name: 'Michael Chen', 
    role: 'CEO & Founder', 
    initials: 'MC',
    gradient: 'from-blue-400 via-cyan-500 to-blue-600',
    specialty: 'HealthTech',
    exp: 'Ex-Google'
  },
  { 
    name: 'Emily Rodriguez', 
    role: 'Chief Technology Officer', 
    initials: 'ER',
    gradient: 'from-violet-400 via-purple-500 to-violet-600',
    specialty: 'AI/ML',
    exp: 'Ex-Meta'
  },
  { 
    name: 'Dr. James Wilson', 
    role: 'Head of Research', 
    initials: 'JW',
    gradient: 'from-emerald-400 via-green-500 to-emerald-600',
    specialty: 'Neurology',
    exp: '12+ yrs'
  },
]

const milestones = [
  { year: '2020', title: 'Founded', desc: 'Vision conceived', icon: Sparkles },
  { year: '2021', title: '100 Clinics', desc: 'Early traction', icon: Rocket },
  { year: '2022', title: 'AI Platform', desc: 'Tech breakthrough', icon: Brain },
  { year: '2023', title: 'National', desc: '50+ cities', icon: Globe },
]

export default function About() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-200/30 to-blue-300/30 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-violet-200/30 to-pink-300/30 dark:from-violet-900/20 dark:to-pink-900/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-8"
          >
            <Target className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">About MediCare</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Healthcare{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600">
              Reimagined
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            Founded in 2020, we are on a mission to democratize healthcare through 
            innovative technology and human-centered design.
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              From Garage Startup to{' '}
              <span className="text-cyan-600 dark:text-cyan-400">Industry Leader</span>
            </h3>
            
            <div className="space-y-4 text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              <p className="text-lg">
                What began as a frustration with paper-based appointments has evolved into 
                a comprehensive platform serving millions of patients globally.
              </p>
              <p>
                We believe technology should amplify human care, not replace it. Our AI-powered 
                tools eliminate administrative burden so providers can focus on healing.
              </p>
            </div>

            {/* Milestones */}
            <div className="grid grid-cols-2 gap-3">
              {milestones.map((milestone, idx) => {
                const Icon = milestone.icon
                return (
                  <motion.div 
                    key={milestone.year} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{milestone.year}</div>
                      <div className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">{milestone.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{milestone.desc}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Modern Visual */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 aspect-square shadow-2xl">
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} />
              
              {/* Glowing Orbs */}
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/30 rounded-full blur-3xl" />
              <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-violet-500/30 rounded-full blur-3xl" />
              
              {/* Central Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-48 h-48 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center"
                >
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="w-36 h-36 rounded-full border border-white/10 flex items-center justify-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                      <Heart className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Floating Stats */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-8 left-8 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Growth</div>
                    <div className="text-sm font-bold text-white">+340%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-white/60">Active Users</div>
                    <div className="text-sm font-bold text-white">10K+</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Rating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-200 dark:border-slate-700 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  4.9
                </div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Excellent</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Based on 2,400+ reviews</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our Core Values
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              The principles that guide every decision we make and every feature we build.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {value.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }} />
            
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Practice?
              </h3>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of healthcare providers who trust MediCare for their daily operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/50 text-white rounded-full font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}