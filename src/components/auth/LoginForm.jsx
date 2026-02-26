'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowLeft,
  CheckCircle2,
  Heart,
  User,             
  ShieldCheck,      
  UserCog,          
  XCircle,
  AlertCircle,
  RotateCcw,
  Activity,
  Stethoscope,
  Sun,
  Moon
} from 'lucide-react';

import { FaUserMd } from 'react-icons/fa';

// Theme Toggle Component
const ThemeToggle = ({ darkMode, setDarkMode }) => (
  <motion.button
    onClick={() => setDarkMode(!darkMode)}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className={`fixed top-4 right-4 z-50 p-3 rounded-full backdrop-blur-md border transition-all duration-300 ${
      darkMode 
        ? 'bg-slate-800/80 border-slate-700 text-yellow-400 hover:bg-slate-700' 
        : 'bg-white/80 border-gray-200 text-orange-500 hover:bg-gray-100'
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
const ParticleBackground = ({ role, darkMode }) => {
  const [particles, setParticles] = useState([]);

  const getRoleColors = () => {
    switch (role) {
      case 'patient':
        return { 
          primary: darkMode ? 'cyan' : 'blue', 
          secondary: darkMode ? 'blue' : 'cyan', 
          glow: darkMode ? 'rgba(34, 211, 238, 0.3)' : 'rgba(59, 130, 246, 0.3)',
          bg: darkMode ? 'from-slate-950 via-slate-900 to-blue-950/30' : 'from-blue-50 via-white to-cyan-50'
        };
      case 'doctor':
        return { 
          primary: 'emerald', 
          secondary: 'green', 
          glow: darkMode ? 'rgba(16, 185, 129, 0.3)' : 'rgba(34, 197, 94, 0.3)',
          bg: darkMode ? 'from-slate-950 via-slate-900 to-emerald-950/30' : 'from-emerald-50 via-white to-green-50'
        };
      case 'admin':
        return { 
          primary: 'violet', 
          secondary: 'purple', 
          glow: darkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(168, 85, 247, 0.3)',
          bg: darkMode ? 'from-slate-950 via-slate-900 to-violet-950/30' : 'from-violet-50 via-white to-purple-50'
        };
      case 'superadmin':
        return { 
          primary: 'rose', 
          secondary: 'red', 
          glow: darkMode ? 'rgba(244, 63, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
          bg: darkMode ? 'from-slate-950 via-slate-900 to-rose-950/30' : 'from-rose-50 via-white to-red-50'
        };
      default:
        return { 
          primary: darkMode ? 'cyan' : 'blue', 
          secondary: darkMode ? 'indigo' : 'indigo', 
          glow: darkMode ? 'rgba(34, 211, 238, 0.3)' : 'rgba(99, 102, 241, 0.3)',
          bg: darkMode ? 'from-slate-950 via-slate-900 to-indigo-950/30' : 'from-indigo-50 via-white to-blue-50'
        };
    }
  };

  const colors = getRoleColors();

  useEffect(() => {
    const initialParticles = Array.from({ length: darkMode ? 60 : 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (darkMode ? 3 : 4) + 1,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 8,
      opacity: Math.random() * (darkMode ? 0.4 : 0.6) + 0.1,
    }));
    setParticles(initialParticles);
  }, [role, darkMode]);

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none transition-colors duration-500 ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} transition-all duration-500`} />
      
      {/* Radial Gradient Overlay */}
      <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${darkMode ? 'from-slate-950/50' : 'from-white/50'} to-transparent transition-all duration-500`} />
      
      {/* Animated Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${darkMode ? `bg-${colors.primary}-400` : `bg-${colors.primary}-500`}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            boxShadow: darkMode ? `0 0 ${particle.size * 2}px ${colors.glow}` : 'none',
          }}
          animate={{
            y: [0, -120, 0],
            x: [0, Math.random() * 60 - 30, 0],
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

      {/* Floating Medical Icons */}
      <motion.div
        className={`absolute top-20 left-10 ${darkMode ? `text-${colors.primary}-500/20` : `text-${colors.primary}-400/30`}`}
        animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart size={48} />
      </motion.div>

      <motion.div
        className={`absolute top-40 right-20 ${darkMode ? `text-${colors.secondary}-500/20` : `text-${colors.secondary}-400/30`}`}
        animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Activity size={40} />
      </motion.div>

      <motion.div
        className={`absolute bottom-32 left-20 ${darkMode ? `text-${colors.primary}-500/15` : `text-${colors.primary}-400/25`}`}
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <ShieldCheck size={44} />
      </motion.div>

      <motion.div
        className={`absolute bottom-20 right-10 ${darkMode ? `text-${colors.secondary}-500/15` : `text-${colors.secondary}-400/25`}`}
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <User size={36} />
      </motion.div>

      <motion.div
        className={`absolute top-1/3 left-1/4 ${darkMode ? `text-${colors.primary}-500/10` : `text-${colors.primary}-400/20`}`}
        animate={{ y: [0, -30, 0], rotate: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <Stethoscope size={56} />
      </motion.div>

      {/* Grid Pattern */}
      <div 
        className={`absolute inset-0 ${darkMode ? 'opacity-[0.03]' : 'opacity-[0.05]'}`}
        style={{
          backgroundImage: `linear-gradient(${darkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(59, 130, 246, 0.3)'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(59, 130, 246, 0.3)'} 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Vignette Effect - Dark mode only */}
      {darkMode && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(2,6,23,0.4)_100%)]" />
      )}
    </div>
  );
};

export default function LoginForm({ 
  role, 
  roleLabel, 
  roleColor, 
  iconElement,
  redirectPath 
}) {
  const [darkMode, setDarkMode] = useState(true); // Default dark mode
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: ''
  });

  const [toast, setToast] = useState({
    show: false,
    type: 'idle',
    message: '',
    animation: 'slide'
  });

  const router = useRouter();

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  useEffect(() => {
    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
  }, [email]);

  useEffect(() => {
    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
  }, [password]);

  const getRoleIcon = () => {
    switch (role) {
      case 'doctor': return <FaUserMd className="w-7 h-7 sm:w-8 sm:h-8 text-white" />;
      case 'admin': return <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />;
      case 'patient': return <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />;
      case 'superadmin': return <UserCog className="w-7 h-7 sm:w-8 sm:h-8 text-white" />;
      default: return <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />;
    }
  };

  const roleIcon = getRoleIcon();

  const getRoleTheme = () => {
    const themes = {
      patient: {
        dark: {
          iconBg: 'from-blue-500 to-cyan-600',
          iconShadow: 'shadow-blue-500/25',
          headerGradient: 'from-blue-900/80 to-slate-900',
          accentColor: 'blue',
          buttonGradient: 'from-blue-600 to-cyan-600',
          buttonHover: 'hover:from-blue-500 hover:to-cyan-500',
          linkColor: 'text-blue-400 hover:text-blue-300',
          focusRing: 'focus:ring-blue-500',
          iconColor: 'text-blue-400',
          errorColor: 'text-rose-400',
          borderColor: 'border-blue-500/30',
          cardBg: 'bg-slate-900/80',
          inputBg: 'bg-slate-800/50',
          textPrimary: 'text-white',
          textSecondary: 'text-slate-300',
          textMuted: 'text-slate-400',
        },
        light: {
          iconBg: 'from-blue-500 to-cyan-500',
          iconShadow: 'shadow-blue-500/25',
          headerGradient: 'from-blue-600 to-cyan-600',
          accentColor: 'blue',
          buttonGradient: 'from-blue-600 to-cyan-600',
          buttonHover: 'hover:from-blue-500 hover:to-cyan-500',
          linkColor: 'text-blue-600 hover:text-blue-700',
          focusRing: 'focus:ring-blue-500',
          iconColor: 'text-blue-500',
          errorColor: 'text-rose-500',
          borderColor: 'border-blue-200',
          cardBg: 'bg-white/90',
          inputBg: 'bg-white',
          textPrimary: 'text-gray-900',
          textSecondary: 'text-gray-700',
          textMuted: 'text-gray-500',
        }
      },
      doctor: {
        dark: {
          iconBg: 'from-emerald-500 to-green-600',
          iconShadow: 'shadow-emerald-500/25',
          headerGradient: 'from-emerald-900/80 to-slate-900',
          accentColor: 'emerald',
          buttonGradient: 'from-emerald-600 to-green-600',
          buttonHover: 'hover:from-emerald-500 hover:to-green-500',
          linkColor: 'text-emerald-400 hover:text-emerald-300',
          focusRing: 'focus:ring-emerald-500',
          iconColor: 'text-emerald-400',
          errorColor: 'text-rose-400',
          borderColor: 'border-emerald-500/30',
          cardBg: 'bg-slate-900/80',
          inputBg: 'bg-slate-800/50',
          textPrimary: 'text-white',
          textSecondary: 'text-slate-300',
          textMuted: 'text-slate-400',
        },
        light: {
          iconBg: 'from-emerald-500 to-green-500',
          iconShadow: 'shadow-emerald-500/25',
          headerGradient: 'from-emerald-600 to-green-600',
          accentColor: 'emerald',
          buttonGradient: 'from-emerald-600 to-green-600',
          buttonHover: 'hover:from-emerald-500 hover:to-green-500',
          linkColor: 'text-emerald-600 hover:text-emerald-700',
          focusRing: 'focus:ring-emerald-500',
          iconColor: 'text-emerald-500',
          errorColor: 'text-rose-500',
          borderColor: 'border-emerald-200',
          cardBg: 'bg-white/90',
          inputBg: 'bg-white',
          textPrimary: 'text-gray-900',
          textSecondary: 'text-gray-700',
          textMuted: 'text-gray-500',
        }
      },
      admin: {
        dark: {
          iconBg: 'from-violet-500 to-purple-600',
          iconShadow: 'shadow-violet-500/25',
          headerGradient: 'from-violet-900/80 to-slate-900',
          accentColor: 'violet',
          buttonGradient: 'from-violet-600 to-purple-600',
          buttonHover: 'hover:from-violet-500 hover:to-purple-500',
          linkColor: 'text-violet-400 hover:text-violet-300',
          focusRing: 'focus:ring-violet-500',
          iconColor: 'text-violet-400',
          errorColor: 'text-rose-400',
          borderColor: 'border-violet-500/30',
          cardBg: 'bg-slate-900/80',
          inputBg: 'bg-slate-800/50',
          textPrimary: 'text-white',
          textSecondary: 'text-slate-300',
          textMuted: 'text-slate-400',
        },
        light: {
          iconBg: 'from-violet-500 to-purple-500',
          iconShadow: 'shadow-violet-500/25',
          headerGradient: 'from-violet-600 to-purple-600',
          accentColor: 'violet',
          buttonGradient: 'from-violet-600 to-purple-600',
          buttonHover: 'hover:from-violet-500 hover:to-purple-500',
          linkColor: 'text-violet-600 hover:text-violet-700',
          focusRing: 'focus:ring-violet-500',
          iconColor: 'text-violet-500',
          errorColor: 'text-rose-500',
          borderColor: 'border-violet-200',
          cardBg: 'bg-white/90',
          inputBg: 'bg-white',
          textPrimary: 'text-gray-900',
          textSecondary: 'text-gray-700',
          textMuted: 'text-gray-500',
        }
      },
      superadmin: {
        dark: {
          iconBg: 'from-rose-500 to-red-600',
          iconShadow: 'shadow-rose-500/25',
          headerGradient: 'from-rose-900/80 to-slate-900',
          accentColor: 'rose',
          buttonGradient: 'from-rose-600 to-red-600',
          buttonHover: 'hover:from-rose-500 hover:to-red-500',
          linkColor: 'text-rose-400 hover:text-rose-300',
          focusRing: 'focus:ring-rose-500',
          iconColor: 'text-rose-400',
          errorColor: 'text-orange-400',
          borderColor: 'border-rose-500/30',
          cardBg: 'bg-slate-900/80',
          inputBg: 'bg-slate-800/50',
          textPrimary: 'text-white',
          textSecondary: 'text-slate-300',
          textMuted: 'text-slate-400',
        },
        light: {
          iconBg: 'from-rose-500 to-red-500',
          iconShadow: 'shadow-rose-500/25',
          headerGradient: 'from-rose-600 to-red-600',
          accentColor: 'rose',
          buttonGradient: 'from-rose-600 to-red-600',
          buttonHover: 'hover:from-rose-500 hover:to-red-500',
          linkColor: 'text-rose-600 hover:text-rose-700',
          focusRing: 'focus:ring-rose-500',
          iconColor: 'text-rose-500',
          errorColor: 'text-orange-500',
          borderColor: 'border-rose-200',
          cardBg: 'bg-white/90',
          inputBg: 'bg-white',
          textPrimary: 'text-gray-900',
          textSecondary: 'text-gray-700',
          textMuted: 'text-gray-500',
        }
      }
    };
    
    return themes[role]?.[darkMode ? 'dark' : 'light'] || themes.patient.dark;
  };

  const theme = getRoleTheme();

  const getToastAnimation = (userRole) => {
    const animations = {
      patient: { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } },
      doctor: { initial: { opacity: 0, x: -100 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 100 } },
      admin: { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } },
      superadmin: { initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.5 } }
    };
    return animations[userRole] || animations.patient;
  };

  const getApiEndpoint = (userRole) => {
    return userRole === 'superadmin' ? '/api/super-admin/login' : '/api/auth/login';
  };

  const parseFieldErrors = (apiMessage, errors) => {
    const newErrors = { email: '', password: '' };
    
    if (errors) {
      if (errors.email) newErrors.email = Array.isArray(errors.email) ? errors.email[0] : errors.email;
      if (errors.password) newErrors.password = Array.isArray(errors.password) ? errors.password[0] : errors.password;
    }
    
    if (!newErrors.email && !newErrors.password) {
      const msg = apiMessage?.toLowerCase() || '';
      if (msg.includes('email') || msg.includes('not found')) newErrors.email = 'This email is not registered.';
      else if (msg.includes('password') || msg.includes('incorrect')) newErrors.password = 'Incorrect password.';
      else if (msg.includes('verify') || msg.includes('activate')) newErrors.email = 'Please verify your email.';
      else newErrors.password = 'Invalid credentials.';
    }
    
    return newErrors;
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setFieldErrors({ email: '', password: '' });
    setShowPassword(false);
    
    setToast({
      show: true,
      type: 'success',
      message: 'Form reset successfully!',
      animation: role
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setToast({ show: false, type: 'idle', message: '', animation: 'slide' });
    setFieldErrors({ email: '', password: '' });

    let hasError = false;
    if (!email.trim()) {
      setFieldErrors(prev => ({ ...prev, email: 'Email is required' }));
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setFieldErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      hasError = true;
    }
    
    if (!password) {
      setFieldErrors(prev => ({ ...prev, password: 'Password is required' }));
      hasError = true;
    } else if (password.length < 6) {
      setFieldErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const apiEndpoint = getApiEndpoint(role);
      const requestBody = role === 'superadmin' 
        ? { email, password }
        : { email, password, role };

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        setToast({
          show: true,
          type: 'success',
          message: `Welcome, ${roleLabel}! Redirecting...`,
          animation: role
        });

        setTimeout(() => {
          const userRole = data.user?.role || role;
          const dashboardPaths = {
            'admin': '/admin/dashboard',
            'doctor': '/doctor/dashboard',
            'patient': '/patient/dashboard',
            'superadmin': '/super-admin/dashboard'
          };
          router.push(dashboardPaths[userRole] || redirectPath || '/');
          router.refresh();
        }, 1500);
      } else {
        const parsedErrors = parseFieldErrors(data.message, data.errors);
        setFieldErrors(parsedErrors);
        setToast({
          show: true,
          type: 'error',
          message: data.message || 'Login failed. Check your credentials.',
          animation: role
        });
      }
    } catch (err) {
      setToast({
        show: true,
        type: 'error',
        message: 'Network error. Please try again.',
        animation: role
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
          bg: isDark ? 'bg-emerald-900/90 border-emerald-700 text-emerald-100' : 'bg-emerald-50 border-emerald-200 text-emerald-800',
          icon: <CheckCircle2 className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />,
          bar: 'bg-emerald-500'
        };
      case 'error':
        return {
          bg: isDark ? 'bg-rose-900/90 border-rose-700 text-rose-100' : 'bg-rose-50 border-rose-200 text-rose-800',
          icon: <XCircle className={`w-5 h-5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />,
          bar: 'bg-rose-500'
        };
      default:
        return {
          bg: isDark ? 'bg-slate-800/90 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800',
          icon: <AlertCircle className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`} />,
          bar: 'bg-slate-500'
        };
    }
  };

  const toastStyles = getToastStyles(toast.type);
  const toastAnimation = getToastAnimation(toast.animation);

  const getInputClasses = (hasError) => `
    w-full pl-10 pr-10 py-3 rounded-lg border transition-all
    ${hasError 
      ? `${darkMode ? 'border-rose-500 focus:ring-rose-500 bg-rose-950/30 text-white placeholder-rose-300/50' : 'border-rose-500 focus:ring-rose-500 bg-rose-50 text-gray-900 placeholder-rose-400'}`
      : `${darkMode ? `border-slate-600 ${theme.focusRing} ${theme.inputBg} text-white placeholder-slate-400` : `border-gray-300 ${theme.focusRing} bg-white text-gray-900 placeholder-gray-400`}`
    }
    focus:outline-none focus:ring-2 focus:border-transparent
  `;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      {/* Theme Toggle - Top Right */}
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Animated Background */}
      <ParticleBackground role={role} darkMode={darkMode} />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={toastAnimation.initial}
            animate={toastAnimation.animate}
            exit={toastAnimation.exit}
            className="fixed top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-md z-50"
          >
            <div className={`relative overflow-hidden rounded-xl border backdrop-blur-md ${toastStyles.bg} shadow-2xl`}>
              <div className={`absolute top-0 left-0 w-full h-1 ${darkMode ? 'bg-white/10' : 'bg-gray-200/50'}`}>
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className={`h-full ${toastStyles.bar}`}
                />
              </div>
              <div className="p-4 flex items-start gap-3">
                {toastStyles.icon}
                <p className="text-sm font-medium flex-1">{toast.message}</p>
                <button onClick={() => setToast(prev => ({ ...prev, show: false }))}>
                  <XCircle className={`w-5 h-5 ${darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md ${theme.cardBg} backdrop-blur-xl rounded-2xl shadow-2xl border ${theme.borderColor} overflow-hidden relative z-10 transition-colors duration-500`}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${theme.headerGradient} ${theme.textPrimary} px-6 py-6 text-center relative overflow-hidden border-b ${theme.borderColor} transition-all duration-500`}>
          <div className={`absolute inset-0 bg-gradient-to-r from-${theme.accentColor}-500/10 to-transparent`} />
          <div className={`absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]`} />
          
          <motion.div 
            className={`inline-flex p-4 bg-gradient-to-br ${theme.iconBg} rounded-full mb-4 shadow-lg ${theme.iconShadow} relative z-10`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {roleIcon}
          </motion.div>
          <h1 className={`text-2xl sm:text-3xl font-bold relative z-10 ${theme.textPrimary}`}>{roleLabel} Login</h1>
          <p className={`${theme.textMuted} mt-2 text-sm relative z-10`}>Sign in to access your dashboard</p>
        </div>

        {/* Form */}
        <div className={`p-6 sm:p-8 ${darkMode ? 'bg-slate-900/50' : 'bg-white/50'} transition-colors duration-500`}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 transition-colors ${fieldErrors.email ? (darkMode ? 'text-rose-400' : 'text-rose-500') : `${darkMode ? 'text-slate-500' : 'text-gray-400'} group-focus-within:${theme.iconColor}`}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={getInputClasses(!!fieldErrors.email)}
                  placeholder="name@example.com"
                />
                {fieldErrors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-1 text-xs ${theme.errorColor} flex items-center gap-1`}
                  >
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.email}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium ${theme.textSecondary} mb-2`}>Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className={`h-5 w-5 transition-colors ${fieldErrors.password ? (darkMode ? 'text-rose-400' : 'text-rose-500') : `${darkMode ? 'text-slate-500' : 'text-gray-400'} group-focus-within:${theme.iconColor}`}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={getInputClasses(!!fieldErrors.password)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-4 flex items-center ${darkMode ? 'text-slate-500' : 'text-gray-500'} ${theme.linkColor} transition-colors`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {fieldErrors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-1 text-xs ${theme.errorColor} flex items-center gap-1`}
                  >
                    <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className={`h-4 w-4 rounded ${darkMode ? `border-slate-600 bg-slate-800 text-${theme.accentColor}-600 ${theme.focusRing} focus:ring-offset-slate-900` : `border-gray-300 bg-white text-${theme.accentColor}-600 ${theme.focusRing}`} transition-all`} 
                />
                <span className={`${theme.textMuted} group-hover:${theme.textSecondary} transition-colors`}>Remember me</span>
              </label>
              <Link href="/forgot-password" className={`${theme.linkColor} font-medium hover:underline transition-all`}>
                Forgot password?
              </Link>
            </div>

            {/* Submit + Reset */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-white transition-all ${
                  loading 
                    ? (darkMode ? 'bg-slate-700 cursor-not-allowed' : 'bg-gray-400 cursor-not-allowed')
                    : `bg-gradient-to-r ${theme.buttonGradient} ${theme.buttonHover} hover:shadow-lg ${theme.iconShadow}`
                } flex items-center justify-center gap-2 shadow-lg`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-3 px-6 rounded-lg font-medium ${darkMode ? 'text-slate-300 border-slate-600 hover:bg-slate-800 hover:border-slate-500 hover:text-white' : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'} border transition-all flex items-center justify-center gap-2`}
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </motion.button>
            </div>
          </form>

          {/* Footer */}
          <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-slate-700/50' : 'border-gray-200'} text-center text-sm ${theme.textMuted}`}>
            <Link href="/" className={`flex items-center justify-center gap-2 ${theme.linkColor} transition-colors group`}>
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to role selection
            </Link>

            {role === 'patient' && (
              <div className="mt-4">
                Don't have an account?{' '}
                <Link href="/register/patient" className={`${theme.linkColor} font-medium hover:underline transition-colors`}>
                  Register as Patient
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}