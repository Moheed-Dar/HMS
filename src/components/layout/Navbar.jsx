'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaUserMd, 
  FaUserTie,
  FaUserShield
} from 'react-icons/fa'
import { ChevronDown, Sun, Moon } from 'lucide-react'

const navLinks = [
  { name: 'Home',     href: '/' },              // ← goes to homepage (root)
  { name: 'Features', href: '/#features' },     // ← homepage + scroll to Features
  { name: 'How it Works', href: '/#steps' },
  { name: 'Modules',  href: '/#dashboards' },
  { name: 'Pricing',  href: '/#pricing' },
  { name: 'About Us', href: '/#about' },
  { name: 'Contact Us', href: '/#contact' },
];
const loginOptions = [
  { 
    icon: FaUser, 
    label: 'Patient', 
    color: 'text-blue-500',
    href: '/login/patient',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-500/10'
  },
  { 
    icon: FaUserMd, 
    label: 'Doctor', 
    color: 'text-green-500',
    href: '/login/doctor',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    hoverColor: 'hover:bg-green-50 dark:hover:bg-green-500/10'
  },
  { 
    icon: FaUserTie, 
    label: 'Admin', 
    color: 'text-purple-500',
    href: '/login/admin',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    hoverColor: 'hover:bg-purple-50 dark:hover:bg-purple-500/10'
  },
  { 
    icon: FaUserShield,
    label: 'Super Admin', 
    color: 'text-red-500',
    href: '/login/super-admin',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    hoverColor: 'hover:bg-red-50 dark:hover:bg-red-500/10'
  },
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
        } ${mobileMenuOpen ? 'hidden lg:block' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo with Text */}
            <motion.div whileHover={{ scale: 1.02 }}>
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative">
                  <img 
                    src="/logo2.png" 
                    alt="MediCare Logo" 
                    className="md:h-12 h-10 w-auto object-contain"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                </div>
                <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">MediCare</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all duration-300"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
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

              {/* Desktop Login Dropdown */}
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
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden py-2"
                    >
                      <p className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Login as
                      </p>
                      {loginOptions.map((option) => (
                        <Link
                          key={option.label}
                          href={option.href}
                          onClick={() => setLoginDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
                        >
                          <div className={`p-2 rounded-lg ${option.bgColor} group-hover:scale-110 transition-transform`}>
                            <option.icon className={`w-4 h-4 ${option.color}`} />
                          </div>
                          <span className="font-medium">{option.label}</span>
                        </Link>
                      ))}
                      <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2 px-2">
                        <Link
                          href="/register/patient"
                          onClick={() => setLoginDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors font-medium"
                        >
                          <FaUser className="w-4 h-4" />
                          New Patient? Register
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register/clinic"
                  className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                >
                  Register Clinic
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open menu"
              >
                <FaBars size={24} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white dark:bg-slate-900 lg:hidden"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <img 
                  src="/logo2.png" 
                  alt="MediCare Logo" 
                  className="h-8 w-auto object-contain"
                />
                <span className="text-xl font-bold text-slate-900 dark:text-white">MediCare</span>
              </Link>
              
              <div className="flex items-center gap-4">
                {/* Dark Mode Toggle */}
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

                {/* Close Button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  aria-label="Close menu"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="px-6 py-8 space-y-1">
              {navLinks.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-4 text-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Login Options */}
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-6">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Login as</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {loginOptions.map((option) => (
                  <Link
                    key={option.label}
                    href={option.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl ${option.hoverColor} transition-colors border border-slate-200 dark:border-slate-700 group`}
                  >
                    <div className={`p-3 rounded-lg ${option.bgColor} group-hover:scale-110 transition-transform`}>
                      <option.icon className={`w-6 h-6 ${option.color}`} />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{option.label}</span>
                  </Link>
                ))}
              </div>

              {/* New Patient Registration Link */}
              <Link
                href="/register/patient"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-3 mb-4 text-sm text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-colors font-medium"
              >
                New Patient? Create Account
              </Link>

              {/* Register Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register/clinic"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Register Clinic
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

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