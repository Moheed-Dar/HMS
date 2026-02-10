import { FaHospital, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa'

const footerLinks = {
  Product: ['Features', 'Modules', 'How it Works', 'Contact'],
  Company: ['About Us', 'Privacy Policy', 'Terms of Service'],
  'Get Started': ['Login', 'Register Clinic', 'Request Demo'],
}

const socialLinks = [
  { icon: FaLinkedin, href: '#' },
  { icon: FaTwitter, href: '#' },
  { icon: FaFacebook, href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <FaHospital className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white">MediCare</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 max-w-sm">
              Modern hospital management system designed for clinics and healthcare providers in India. Streamline your practice with our all-in-one solution.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-cyan-600 hover:text-white transition-all duration-300"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-semibold mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-cyan-400 transition-colors">
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
            <a href="mailto:medicarehospital@gmail.com" className="hover:text-cyan-400 transition-colors">
              medicarehospital@gmail.com
            </a>
            <a href="tel:+923063333557" className="hover:text-cyan-400 transition-colors">
              +92-306-333-3557
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-slate-500">
          <p>© 2025 MediCare. All rights reserved.</p>
          <p className="mt-2">Made with Pakistan</p>
        </div>
      </div>
    </footer>
  )
}