'use client'

import { motion } from 'framer-motion'
import SectionHeader from '../ui/SectionHeader'
import Card from '../ui/Card'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Clinic Owner, Mumbai',
    image: 'PS',
    content: 'OneCare has transformed how we manage our clinic. The WhatsApp integration alone has reduced no-shows by 35%.',
    rating: 5,
  },
  {
    name: 'Rajesh Kumar',
    role: 'Hospital Administrator, Delhi',
    image: 'RK',
    content: 'Finally, an HMS that\'s actually easy to use. Our staff picked it up in a day. The billing module is exceptional.',
    rating: 5,
  },
  {
    name: 'Dr. Anil Patel',
    role: 'General Physician, Pune',
    image: 'AP',
    content: 'The patient portal is a game-changer. Our patients love booking appointments online and accessing their records.',
    rating: 5,
  },
  {
    name: 'Dr. Meera Reddy',
    role: 'Dental Clinic, Bangalore',
    image: 'MR',
    content: 'Seamless Razorpay integration made collecting payments so much easier. Highly recommend for any clinic.',
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Testimonials"
          title="What Our Users"
          highlight="Say"
          description="Trusted by healthcare providers across India"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full relative">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-cyan-200" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-slate-500">
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