"use client";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Steps from "@/components/sections/Steps";
import Dashboards from "@/components/sections/Dashboards";
import WhatsAppSection from "@/components/sections/WhatsAppSection";
import Integrations from "@/components/sections/Integrations";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Steps />
      <Dashboards />
      <WhatsAppSection />
      <Integrations />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}
