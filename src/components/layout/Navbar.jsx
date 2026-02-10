'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaUserMd, 
  FaUserTie 
} from 'react-icons/fa'
import { ChevronDown, Sun, Moon } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'How it Works', href: '#steps' },
  { name: 'Modules', href: '#dashboards' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About Us', href: '#about' },
  { name: 'Contact Us', href: '#contact' },
]

const loginOptions = [
  { icon: FaUser, label: 'Patient', color: 'text-blue-500' },
  { icon: FaUserMd, label: 'Doctor', color: 'text-green-500' },
  { icon: FaUserTie, label: 'Admin', color: 'text-purple-500' },
  { icon: FaUserTie, label: 'Super Admin', color: 'text-red-500' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) return null

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          resolvedTheme === 'dark'
            ? scrolled 
              ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg border-b border-slate-800'
              : 'bg-slate-900/95 backdrop-blur-xl'
            : scrolled 
              ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-slate-100'
              : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Updated with image */}
            <motion.a
              href="#home"
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <img 
                  src="/logo2.png" 
                  alt="MediCare Logo" 
                  className="md:h-12 h-10 w-auto object-contain"
                />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all duration-300"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle - Instant */}
              <motion.button
                onClick={toggleTheme}
                className="relative p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </motion.button>

              {/* Login Dropdown */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Login
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${loginDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {loginDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden"
                    >
                      {loginOptions.map((option) => (
                        <button
                          key={option.label}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                        >
                          <option.icon className={option.color} />
                          {option.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
              >
                Register Clinic
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800"
            >
              <div className="px-4 py-6 space-y-2">
                {navLinks.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="block px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-3 px-4">Login as</p>
                  <div className="grid grid-cols-3 gap-2 px-4">
                    {loginOptions.map((option) => (
                      <button
                        key={option.label}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors"
                      >
                        <option.icon className={option.color} />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Overlay for login dropdown */}
      {loginDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setLoginDropdownOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}