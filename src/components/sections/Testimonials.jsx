'use client'

import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import Card from '../ui/Card'
import { Star, MessageSquare } from 'lucide-react'

const testimonials = [
  {
    name: 'Dr. Muhammad Ali',
    role: 'Healthcare Director, Karachi',
    image: 'MA',
    content: 'MediCare has completely transformed our medical practice management. The messaging system alone has cut down missed appointments by nearly 32%.',
    rating: 5,
  },
  {
    name: 'Ayesha Khan',
    role: 'Clinic Supervisor, Lahore',
    image: 'AK',
    content: 'At last, we have a healthcare platform that\'s genuinely user-friendly. Our entire team mastered it within hours. The financial tracking is superb.',
    rating: 5,
  },
  {
    name: 'Dr. Imran Ahmed',
    role: 'Medical Practitioner, Islamabad',
    image: 'IA',
    content: 'The digital patient interface has been revolutionary. Our clients enjoy the ease of online scheduling and immediate access to their health information.',
    rating: 5,
  },
  {
    name: 'Dr. Zara Siddiqui',
    role: 'Dental Specialist, Rawalpindi',
    image: 'ZS',
    content: 'The integrated payment processing has made our financial operations so much smoother. I wholeheartedly endorse this for any healthcare facility.',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-32 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Customer Feedback"
          title={<span className="text-slate-900 dark:text-slate-100">Voices of Our</span>}
          highlight={<span className="text-slate-900 dark:text-slate-100">Community</span>}
          description={<span className="text-slate-600 dark:text-slate-400">Chosen by healthcare experts throughout the region</span>}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex"
            >
              <Card className="h-full flex flex-col cursor-pointer relative dark:bg-slate-800/50 dark:border-slate-700">
                <MessageSquare className="absolute top-4 right-4 w-8 h-8 text-cyan-200 dark:text-cyan-300/20" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-200 text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}