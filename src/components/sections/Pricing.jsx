'use client'

import { motion } from 'framer-motion'
import { Check, X, Sparkles, Zap, Building2, ArrowRight, Shield, Clock, CreditCard, Star, Crown, Gem } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '49',
    period: '/month',
    description: 'Perfect for small clinics getting started',
    features: [
      'Up to 100 patients',
      'Basic appointment scheduling',
      'Email notifications',
      'PDF reports',
      'WhatsApp integration',
    ],
    notIncluded: [
      'Video consultations',
      'Advanced analytics',
      'Multi-clinic support',
    ],
    icon: Zap,
    gradient: 'from-emerald-400 to-teal-500',
    bgGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    popular: false,
  },
  {
    name: 'Professional',
    price: '99',
    period: '/month',
    description: 'Ideal for growing medical practices',
    features: [
      'Unlimited patients',
      'Advanced scheduling',
      'Video consultations',
      'WhatsApp & SMS',
      'Email notifications',
      'PDF & custom reports',
      'Basic analytics',
    ],
    notIncluded: [
      'Multi-clinic support',
      'API access',
    ],
    icon: Crown,
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    bgGradient: 'from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20',
    borderColor: 'border-violet-200 dark:border-violet-800',
    textColor: 'text-violet-600 dark:text-violet-400',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '199',
    period: '/month',
    description: 'For large hospitals and clinic chains',
    features: [
      'Everything in Professional',
      'Unlimited clinics',
      'Advanced analytics & AI',
      'Custom integrations',
      'API access',
      '24/7 priority support',
      'Dedicated account manager',
    ],
    notIncluded: [],
    icon: Gem,
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    bgGradient: 'from-amber-50 to-rose-50 dark:from-amber-900/20 dark:to-rose-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-600 dark:text-amber-400',
    popular: false,
  },
]

const trustBadges = [
  { icon: Shield, label: 'SSL Secured' },
  { icon: Clock, label: '24/7 Support' },
  { icon: CreditCard, label: 'Cancel Anytime' },
  { icon: Star, label: 'Rated 4.9/5' },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Elegant Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.15),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.08),transparent_50%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Pricing Plans</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Simple, transparent{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
              pricing
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            Choose the perfect plan for your practice. All plans include a 14-day free trial with no credit card required.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`relative group ${plan.popular ? 'lg:-my-4 lg:scale-105 z-10' : ''}`}
              >
                <div className={`h-full rounded-3xl overflow-hidden border ${plan.borderColor} bg-white dark:bg-slate-900/50 backdrop-blur-sm shadow-xl transition-all duration-500 hover:shadow-2xl ${plan.popular ? 'shadow-violet-500/20' : ''}`}>
                  
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
                  )}

                  <div className={`p-8 ${plan.popular ? 'pt-10' : ''}`}>
                    {/* Icon & Name */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                          ${plan.price}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          {plan.period}
                        </span>
                      </div>
                      {plan.popular && (
                        <p className="text-sm text-violet-600 dark:text-violet-400 mt-1 font-medium">
                          Best value for most practices
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-8 ${
                      plan.popular 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-lg' 
                        : `bg-gradient-to-r ${plan.gradient} text-white shadow-md hover:shadow-lg hover:opacity-90`
                    }`}>
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 dark:bg-slate-800 mb-6" />

                    {/* Features */}
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        What's included
                      </p>
                      
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={feature} className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.popular ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-slate-100 dark:bg-slate-800'}`}>
                              <Check className={`w-3 h-3 ${plan.popular ? 'text-violet-600 dark:text-violet-400' : 'text-slate-600 dark:text-slate-400'}`} />
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                        
                        {plan.notIncluded.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 opacity-40">
                            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <X className="w-3 h-3 text-slate-400" />
                            </div>
                            <span className="text-sm text-slate-500 line-through">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap items-center justify-center gap-4"
        >
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{badge.label}</span>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Questions?{' '}
            <a href="#contact" className="text-slate-900 dark:text-white font-semibold hover:underline decoration-2 underline-offset-4">
              Contact our sales team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}