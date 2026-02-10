import { FaHospital, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaWhatsapp } from 'react-icons/fa'

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

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <img 
                  src="/logo2.png" 
                  alt="MediCare Logo" 
                  className="h-12 w-auto object-contain"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <span className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">MediCare</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-md leading-relaxed">
              Advanced healthcare management platform built for medical practices and hospitals across Pakistan. Simplify your operations with our comprehensive digital solution.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-bold text-lg mb-5">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#" 
                      className="text-sm hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400 transition-all duration-300" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <a 
              href="mailto:medicarehospital@gmail.com" 
              className="hover:text-cyan-400 transition-colors flex items-center gap-2 group"
            >
              <FaEnvelope className="w-4 h-4 text-cyan-400/50 group-hover:text-cyan-400 transition-colors" />
              medicarehospital@gmail.com
            </a>
            <a 
              href="https://wa.me/923063333557" 
              className="hover:text-green-400 transition-colors flex items-center gap-2 group"
            >
              <FaWhatsapp className="w-4 h-4 text-green-400/50 group-hover:text-green-400 transition-colors" />
              +92-306-333-3557
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-slate-500">
          <p className="flex items-center justify-center gap-2">
            <span>© 2025 MediCare.</span>
            <span>All rights reserved.</span>
          </p>
          <p className="mt-2 flex items-center justify-center gap-2">
            <span>Developed with in</span>
            <span className="text-cyan-400 font-semibold">Pakistan</span>
          </p>
        </div>
      </div>
    </footer>
  )
}