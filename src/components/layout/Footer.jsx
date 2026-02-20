'use client'

import { motion } from 'framer-motion'
import { 
  FaHospital, 
  FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube, 
  FaEnvelope, FaWhatsapp 
} from 'react-icons/fa'

const footerLinks = {
  Product: ['Key Features', 'System Modules', 'Quick Start Guide', 'Support'],
  Company: ['Our Story', 'Data Privacy', 'Service Terms'],
  Resources: ['User Login', 'Clinic Registration', 'Book a Demo'],
}

const socialLinks = [
  { icon: FaFacebook, href: '#' },
  { icon: FaTwitter, href: '#' },
  { icon: FaInstagram, href: '#' },
  { icon: FaLinkedin, href: '#' },
  { icon: FaYoutube, href: '#' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-600 dark:text-slate-300 py-20 overflow-hidden transition-colors duration-300">
      {/* Subtle background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/30 via-transparent to-blue-100/20 dark:from-cyan-950/10 dark:via-transparent dark:to-blue-950/5 pointer-events-none" />
      
      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand & Description */}
          <motion.div 
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <img
                  src="/logo2.png"
                  alt="MediCare Logo"
                  className="h-14 w-auto object-contain drop-shadow-lg"
                />
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-800 shadow-lg shadow-green-500/40"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 dark:from-cyan-400 dark:via-blue-500 dark:to-cyan-400 bg-clip-text text-transparent">
                MediCare
              </span>
            </div>

            <p className="text-base text-slate-500 dark:text-slate-400 mb-8 max-w-md leading-relaxed">
              Advanced healthcare management platform crafted for medical practices and hospitals across Pakistan. 
              Empower your facility with secure, intelligent digital tools built for the future of care.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-white hover:bg-gradient-to-br hover:from-cyan-600/80 hover:to-blue-700/80 transition-all duration-400 transform hover:scale-110 shadow-md hover:shadow-cyan-500/20"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <social.icon className="text-xl" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <motion.div 
              key={title}
              variants={itemVariants}
            >
              <h3 className="text-slate-800 dark:text-white font-semibold text-lg mb-6 tracking-wide">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/0 group-hover:bg-cyan-500 dark:group-hover:bg-cyan-400 transition-all duration-400 group-hover:scale-125" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Bar */}
        <motion.div 
          className="border-t border-slate-200 dark:border-slate-800/60 pt-10 pb-12"
          variants={itemVariants}
        >
          <div className="flex flex-wrap justify-center gap-10 text-base">
            <motion.a
              href="mailto:medicarehospital@gmail.com"
              className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group"
              whileHover={{ scale: 1.03 }}
            >
              <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-950/40 flex items-center justify-center">
                <FaEnvelope className="text-cyan-600 dark:text-cyan-400/70 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
              </div>
              medicarehospital@gmail.com
            </motion.a>

            <motion.a
              href="https://wa.me/923063333557 "
              className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
              whileHover={{ scale: 1.03 }}
            >
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
                <FaWhatsapp className="text-green-600 dark:text-green-400/70 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
              </div>
              +92-306-333-3557
            </motion.a>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div 
          className="text-center text-sm text-slate-400 dark:text-slate-500/80"
          variants={itemVariants}
        >
          <p className="flex items-center justify-center gap-2">
            <span>© {new Date().getFullYear()} MediCare.</span>
            <span>All rights reserved.</span>
          </p>
          <p className="mt-3 flex items-center justify-center gap-2">
            <span>Developed with passion in</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-medium">AM-VERTEX</span>
          </p>
        </motion.div>
      </motion.div>
    </footer>
  )
}