'use client'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import Steps from '@/components/sections/Steps'
import Dashboards from '@/components/sections/Dashboards'
import WhatsAppSection from '@/components/sections/WhatsAppSection'
import Integrations from '@/components/sections/Integrations'
import Testimonials from '@/components/sections/Testimonials'
import CTA from '@/components/sections/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Steps />
      <Dashboards />
      <WhatsAppSection />
      <Integrations />
      <Testimonials />
      <CTA />
    </>
  )
}