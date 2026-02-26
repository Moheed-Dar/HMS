'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  UserPlus,
  User,
  Phone,
  MapPin,
  AlertCircle,
  Check,
  X,
  RotateCcw,
  Sun,
  Moon,
  Heart,
  Activity,
  ShieldCheck,
  Stethoscope,
  Home
} from 'lucide-react';

// Theme Toggle Component
const ThemeToggle = ({ darkMode, setDarkMode }) => (
  <motion.button
    onClick={() => setDarkMode(!darkMode)}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className={`fixed top-4 right-4 z-50 p-3 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ${
      darkMode 
        ? 'bg-slate-800/90 border-slate-700 text-yellow-400 hover:bg-slate-700 shadow-slate-900/50' 
        : 'bg-white/90 border-gray-200 text-orange-500 hover:bg-gray-50 shadow-gray-200/50'
    }`}
  >
    <AnimatePresence mode="wait">
      <motion.div
        key={darkMode ? 'dark' : 'light'}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </motion.div>
    </AnimatePresence>
  </motion.button>
);

// Particle Background Component
const ParticleBackground = ({ darkMode }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const initialParticles = Array.from({ length: darkMode ? 50 : 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (darkMode ? 3 : 4) + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      opacity: Math.random() * (darkMode ? 0.4 : 0.6) + 0.1,
    }));
    setParticles(initialParticles);
  }, [darkMode]);

  const colors = darkMode 
    ? { primary: 'cyan', secondary: 'blue', glow: 'rgba(34, 211, 238, 0.3)' }
    : { primary: 'blue', secondary: 'cyan', glow: 'rgba(59, 130, 246, 0.2)' };

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none transition-colors duration-500 ${
      darkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50'
    }`}>
      {darkMode && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/30" />
      )}
      
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${
        darkMode ? 'from-blue-900/20 via-slate-950/50 to-slate-950' : 'from-white/50 to-transparent'
      } transition-all duration-500`} />

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${darkMode ? 'bg-cyan-400' : 'bg-blue-400'}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            boxShadow: darkMode ? `0 0 ${particle.size * 2}px ${colors.glow}` : 'none',
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [particle.opacity, particle.opacity * 0.2, particle.opacity],
            scale: [1, darkMode ? 1.8 : 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        className={`absolute top-20 left-10 ${darkMode ? 'text-cyan-500/20' : 'text-blue-400/30'}`}
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart size={40} />
      </motion.div>

      <motion.div
        className={`absolute top-40 right-20 ${darkMode ? 'text-blue-500/20' : 'text-cyan-400/30'}`}
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Activity size={32} />
      </motion.div>

      <motion.div
        className={`absolute bottom-32 left-20 ${darkMode ? 'text-cyan-500/15' : 'text-blue-400/25'}`}
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <ShieldCheck size={36} />
      </motion.div>

      <motion.div
        className={`absolute bottom-20 right-10 ${darkMode ? 'text-blue-500/15' : 'text-cyan-400/25'}`}
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <User size={28} />
      </motion.div>

      <div 
        className={`absolute inset-0 ${darkMode ? 'opacity-[0.03]' : 'opacity-[0.05]'}`}
        style={{
          backgroundImage: `linear-gradient(${darkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(59, 130, 246, 0.3)'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(59, 130, 246, 0.3)'} 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {darkMode && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.4)_100%)]" />
      )}
    </div>
  );
};

// Custom Input Component
const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  error, 
  darkMode,
  rightElement,
  ...props 
}) => (
  <motion.div 
    animate={error ? { x: [-8, 8, -8, 8, 0] } : {}}
    transition={{ duration: 0.2 }}
    className="relative"
  >
    <label className={`block text-xs font-medium mb-1.5 transition-colors ${
      darkMode ? 'text-slate-300' : 'text-gray-700'
    }`}>
      {label}
    </label>
    <div className="relative">
      <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
        error ? 'text-rose-400' : darkMode ? 'text-slate-500' : 'text-gray-400'
      }`} />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-9 ${rightElement ? 'pr-9' : 'pr-3'} py-2.5 rounded-lg border-2 transition-all duration-200 outline-none text-sm ${
          error 
            ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-900/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20' 
            : darkMode 
              ? 'border-slate-700 bg-slate-800/50 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20' 
              : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
        }`}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
      {error && !rightElement && (
        <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />
      )}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-1 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

// Custom Button Component
const ActionButton = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  loading = false, 
  onClick,
  darkMode,
  className = '',
  ...props 
}) => {
  const baseClasses = "py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  
  const variants = {
    primary: darkMode 
      ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/25"
      : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-500/25",
    secondary: darkMode
      ? "border-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 hover:text-white"
      : "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900",
    ghost: darkMode
      ? "text-slate-400 hover:text-cyan-400 hover:bg-white/5"
      : "text-gray-500 hover:text-blue-600 hover:bg-black/5"
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={!loading ? { scale: 1.02 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default function PatientRegisterPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'idle', message: '' });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    const passed = Object.values(checks).filter(Boolean).length;
    const strength = passed <= 2 ? 'weak' : passed <= 4 ? 'medium' : 'strong';
    return { checks, strength, passed };
  };

  const [passwordStrength, setPasswordStrength] = useState({
    checks: { length: false, uppercase: false, lowercase: false, number: false, special: false },
    strength: 'weak',
    passed: 0
  });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(checkPasswordStrength(formData.password));
    } else {
      setPasswordStrength({
        checks: { length: false, uppercase: false, lowercase: false, number: false, special: false },
        strength: 'weak',
        passed: 0
      });
    }
  }, [formData.password]);

  const clearFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearFieldError(name);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', password: '', phone: '', address: '' });
    setFieldErrors({ name: '', email: '', password: '', phone: '', address: '' });
    setPasswordStrength({
      checks: { length: false, uppercase: false, lowercase: false, number: false, special: false },
      strength: 'weak',
      passed: 0
    });
    setShowPassword(false);
    
    setToast({
      show: true,
      type: 'success',
      message: 'Form cleared successfully!'
    });
  };

  const getPasswordRequirements = () => [
    { label: 'At least 8 characters', met: passwordStrength.checks.length },
    { label: 'One uppercase letter (A-Z)', met: passwordStrength.checks.uppercase },
    { label: 'One lowercase letter (a-z)', met: passwordStrength.checks.lowercase },
    { label: 'One number (0-9)', met: passwordStrength.checks.number },
    { label: 'One special symbol (!@#$%^&*)', met: passwordStrength.checks.special }
  ];

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '', phone: '', address: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      newErrors.phone = 'Phone must be 10-15 digits';
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else {
      const { checks } = passwordStrength;
      if (!checks.length) {
        newErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      } else if (!checks.uppercase) {
        newErrors.password = 'Password must contain at least one uppercase letter';
        isValid = false;
      } else if (!checks.lowercase) {
        newErrors.password = 'Password must contain at least one lowercase letter';
        isValid = false;
      } else if (!checks.number) {
        newErrors.password = 'Password must contain at least one number';
        isValid = false;
      } else if (!checks.special) {
        newErrors.password = 'Password must contain at least one special symbol';
        isValid = false;
      }
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const parseApiErrors = (apiMessage, apiErrors) => {
    const newErrors = { name: '', email: '', password: '', phone: '', address: '' };

    if (apiErrors && typeof apiErrors === 'object') {
      Object.keys(apiErrors).forEach(field => {
        if (newErrors.hasOwnProperty(field)) {
          const msg = apiErrors[field];
          newErrors[field] = Array.isArray(msg) ? msg[0] : msg;
        }
      });
    }

    if (!Object.values(newErrors).some(msg => msg)) {
      const msg = apiMessage?.toLowerCase() || '';
      if (msg.includes('email') || msg.includes('registered') || msg.includes('exists')) {
        newErrors.email = 'This email is already registered';
      } else if (msg.includes('phone') || msg.includes('mobile')) {
        newErrors.phone = 'This phone number is already in use';
      } else if (msg.includes('password') || msg.includes('weak')) {
        newErrors.password = 'Password does not meet security requirements';
      } else if (msg.includes('name')) {
        newErrors.name = 'Please enter a valid name';
      } else if (msg.includes('address')) {
        newErrors.address = 'Please enter a valid address';
      } else {
        newErrors.password = apiMessage || 'Registration failed. Please try again.';
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast({ show: false, type: 'idle', message: '' });

    if (!validateForm()) {
      const firstError = Object.values(fieldErrors).find(msg => msg);
      if (firstError) {
        setToast({ show: true, type: 'error', message: firstError });
      }
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          phone: formData.phone.trim(),
          address: formData.address.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setToast({
          show: true,
          type: 'success',
          message: `Welcome ${data.user.name}! Registration successful. Redirecting...`
        });

        setFormData({ name: '', email: '', password: '', phone: '', address: '' });
        setFieldErrors({ name: '', email: '', password: '', phone: '', address: '' });

        setTimeout(() => {
          router.push('/login/patient');
        }, 1800);
      } else {
        const parsedErrors = parseApiErrors(data.message, data.errors);
        setFieldErrors(parsedErrors);
        setToast({
          show: true,
          type: 'error',
          message: data.message || 'Registration failed. Please check the fields.'
        });
      }
    } catch (err) {
      setToast({
        show: true,
        type: 'error',
        message: 'Network error. Please check your connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getToastStyles = (type) => {
    const isDark = darkMode;
    switch (type) {
      case 'success':
        return {
          bg: isDark ? 'bg-emerald-900/90 border-emerald-700' : 'bg-emerald-50 border-emerald-200',
          text: isDark ? 'text-emerald-100' : 'text-emerald-800',
          icon: <CheckCircle2 className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />,
          bar: 'bg-emerald-500'
        };
      case 'error':
        return {
          bg: isDark ? 'bg-rose-900/90 border-rose-700' : 'bg-rose-50 border-rose-200',
          text: isDark ? 'text-rose-100' : 'text-rose-800',
          icon: <XCircle className={`w-5 h-5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />,
          bar: 'bg-rose-500'
        };
      default:
        return { bg: '', text: '', icon: null, bar: '' };
    }
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'weak': return 'bg-rose-500';
      case 'medium': return 'bg-amber-500';
      case 'strong': return 'bg-emerald-500';
      default: return 'bg-slate-300';
    }
  };

  const toastStyles = getToastStyles(toast.type);
  const requirements = getPasswordRequirements();

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-hidden">
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <ParticleBackground darkMode={darkMode} />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:max-w-md z-[100]"
          >
            <div className={`relative overflow-hidden rounded-xl border backdrop-blur-md shadow-2xl ${toastStyles.bg}`}>
              <div className={`absolute top-0 left-0 w-full h-1 ${darkMode ? 'bg-white/10' : 'bg-gray-200/50'}`}>
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className={`h-full ${toastStyles.bar}`}
                />
              </div>
              <div className="p-4 flex items-start gap-3">
                {toastStyles.icon}
                <p className={`text-sm font-medium flex-1 pr-8 ${toastStyles.text}`}>{toast.message}</p>
                <button
                  onClick={() => setToast(prev => ({ ...prev, show: false }))}
                  className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors ${
                    darkMode ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-700 hover:bg-black/5'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE: Original Vertical Layout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`md:hidden w-full max-w-lg ${darkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-white/50'} backdrop-blur-xl rounded-2xl shadow-2xl border overflow-hidden relative z-10 transition-colors duration-500 max-h-[90vh] overflow-y-auto`}
      >
        {/* Mobile Header */}
        <div className={`px-6 py-5 text-center relative ${
          darkMode ? 'bg-gradient-to-r from-blue-900/80 to-slate-900 border-b border-slate-700/50' : 'bg-gradient-to-r from-blue-600 to-cyan-600'
        }`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-${darkMode ? 'cyan' : 'blue'}-500/10 to-transparent`} />
          
          <motion.div 
            className={`mx-auto w-14 h-14 ${darkMode ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/25' : 'bg-white shadow-blue-500/25'} rounded-2xl flex items-center justify-center shadow-lg mb-3 relative z-10`}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus className={`w-7 h-7 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
          </motion.div>
          
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-white'} relative z-10`}>
            Patient Registration
          </h2>
          <p className={`mt-1 text-xs ${darkMode ? 'text-slate-400' : 'text-blue-100'} relative z-10`}>
            Create your account to access healthcare services
          </p>
        </div>

        {/* Mobile Form */}
        <div className={`px-5 py-5 ${darkMode ? 'bg-slate-900/50' : 'bg-white/50'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                icon={User}
                error={fieldErrors.name}
                darkMode={darkMode}
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                icon={Mail}
                error={fieldErrors.email}
                darkMode={darkMode}
              />
            </div>

            {/* Row 2: Phone & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                icon={Phone}
                error={fieldErrors.phone}
                darkMode={darkMode}
              />
              <FormInput
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House 123, Street 5"
                icon={MapPin}
                error={fieldErrors.address}
                darkMode={darkMode}
              />
            </div>

            {/* Password */}
            <FormInput
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              error={fieldErrors.password}
              darkMode={darkMode}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`${darkMode ? 'text-slate-400 hover:text-cyan-400' : 'text-gray-400 hover:text-blue-500'} transition-colors`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Password Strength */}
            {formData.password && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className={`flex-1 h-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <motion.div 
                      className={`h-full ${getStrengthColor(passwordStrength.strength)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength.passed / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${
                    passwordStrength.strength === 'weak' ? 'text-rose-500' :
                    passwordStrength.strength === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {requirements.map((req, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      {req.met ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <X className={`w-3.5 h-3.5 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`} />
                      )}
                      <span className={req.met ? 'text-emerald-600 dark:text-emerald-400' : darkMode ? 'text-slate-500' : 'text-gray-500'}>
                        {req.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms-mobile" 
                required 
                className={`mt-0.5 h-4 w-4 rounded border-2 transition-all ${
                  darkMode 
                    ? 'border-slate-600 bg-slate-800 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-slate-900' 
                    : 'border-gray-300 bg-white text-blue-600 focus:ring-blue-500'
                }`} 
              />
              <label htmlFor="terms-mobile" className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                I agree to the{' '}
                <Link href="/terms" className={`${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'} hover:underline font-medium`}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className={`${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'} hover:underline font-medium`}>
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <ActionButton 
                type="submit" 
                variant="primary" 
                loading={loading}
                darkMode={darkMode}
                className="flex-1"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </ActionButton>
              
              <ActionButton 
                type="button" 
                variant="secondary" 
                onClick={handleReset}
                darkMode={darkMode}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </ActionButton>
            </div>
          </form>

          {/* Mobile Footer */}
          <div className="mt-5 pt-4 border-t border-dashed text-center space-y-3">
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link 
                href="/login/patient" 
                className={`${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'} font-semibold hover:underline transition-colors`}
              >
                Sign in here
              </Link>
            </p>
            <Link 
              href="/" 
              className={`inline-flex items-center gap-1.5 text-xs ${darkMode ? 'text-slate-500 hover:text-cyan-400' : 'text-gray-500 hover:text-blue-600'} transition-colors group`}
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to home
            </Link>
          </div>
        </div>
      </motion.div>

      {/* DESKTOP: Split Layout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`hidden md:flex w-full max-w-4xl ${darkMode ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/90 border-white/50'} backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden relative z-10 transition-colors duration-500 max-h-[85vh]`}
      >
        {/* Left Side - Info/Branding */}
        <div className={`w-2/5 p-8 flex flex-col justify-center items-center text-center relative ${
          darkMode 
            ? 'bg-gradient-to-br from-blue-900/90 to-slate-900 border-r border-slate-700/50' 
            : 'bg-gradient-to-br from-blue-600 to-cyan-600'
        }`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
          
          <motion.div 
            className={`w-24 h-24 ${darkMode ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-md rounded-3xl flex items-center justify-center shadow-2xl mb-6 border ${darkMode ? 'border-white/10' : 'border-white/30'}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
          >
            <Stethoscope className={`w-12 h-12 ${darkMode ? 'text-cyan-400' : 'text-white'}`} />
          </motion.div>

          <motion.h1 
            className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-white'} mb-2`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Patient Portal
          </motion.h1>

          <motion.p 
            className={`text-sm ${darkMode ? 'text-slate-300' : 'text-blue-100'} mb-8 max-w-xs`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Join our healthcare community and access premium medical services
          </motion.p>

          <div className="space-y-3 w-full max-w-xs">
            {[
              { icon: ShieldCheck, text: "Secure & Private" },
              { icon: Activity, text: "24/7 Health Monitoring" },
              { icon: Heart, text: "Expert Care Team" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                className={`flex items-center gap-3 ${darkMode ? 'bg-white/5' : 'bg-white/10'} backdrop-blur-sm rounded-xl p-3 border ${darkMode ? 'border-white/5' : 'border-white/20'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <item.icon className={`w-5 h-5 ${darkMode ? 'text-cyan-400' : 'text-white'}`} />
                <span className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-white'}`}>{item.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Desktop Left Side Footer */}
          <motion.div 
            className="mt-8 flex flex-col gap-3 w-full max-w-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {/* Sign In Button */}
            <Link href="/login/patient" className="w-full">
              <ActionButton 
                type="button" 
                variant="secondary" 
                darkMode={darkMode}
                className="w-full"
              >
                Already have an account? Sign In
              </ActionButton>
            </Link>

            {/* Back to Home Button */}
            <Link href="/" className="w-full">
              <ActionButton 
                type="button" 
                variant="ghost" 
                darkMode={darkMode}
                className="w-full"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </ActionButton>
            </Link>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className={`w-3/5 p-6 overflow-y-auto ${darkMode ? 'bg-slate-900/30' : 'bg-white/30'}`}>
          <div className="mb-4">
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create Account</h2>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Fill in your details to register</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                icon={User}
                error={fieldErrors.name}
                darkMode={darkMode}
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                icon={Mail}
                error={fieldErrors.email}
                darkMode={darkMode}
              />
            </div>

            {/* Row 2: Phone & Address */}
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                icon={Phone}
                error={fieldErrors.phone}
                darkMode={darkMode}
              />
              <FormInput
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House 123, Street 5"
                icon={MapPin}
                error={fieldErrors.address}
                darkMode={darkMode}
              />
            </div>

            {/* Password */}
            <FormInput
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              error={fieldErrors.password}
              darkMode={darkMode}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`${darkMode ? 'text-slate-400 hover:text-cyan-400' : 'text-gray-400 hover:text-blue-500'} transition-colors`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            {/* Password Strength */}
            {formData.password && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className={`flex-1 h-2 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <motion.div 
                      className={`h-full ${getStrengthColor(passwordStrength.strength)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength.passed / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${
                    passwordStrength.strength === 'weak' ? 'text-rose-500' :
                    passwordStrength.strength === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-1.5">
                  {requirements.map((req, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      {req.met ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <X className={`w-3.5 h-3.5 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`} />
                      )}
                      <span className={req.met ? 'text-emerald-600 dark:text-emerald-400' : darkMode ? 'text-slate-500' : 'text-gray-500'}>
                        {req.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms-desktop" 
                required 
                className={`mt-0.5 h-4 w-4 rounded border-2 transition-all ${
                  darkMode 
                    ? 'border-slate-600 bg-slate-800 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-slate-900' 
                    : 'border-gray-300 bg-white text-blue-600 focus:ring-blue-500'
                }`} 
              />
              <label htmlFor="terms-desktop" className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                I agree to the{' '}
                <Link href="/terms" className={`${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'} hover:underline font-medium`}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className={`${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'} hover:underline font-medium`}>
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-row gap-3 pt-2">
              <ActionButton 
                type="submit" 
                variant="primary" 
                loading={loading}
                darkMode={darkMode}
                className="flex-1"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </ActionButton>
              
              <ActionButton 
                type="button" 
                variant="secondary" 
                onClick={handleReset}
                darkMode={darkMode}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </ActionButton>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}