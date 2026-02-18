'use client';

import { useState, useEffect } from 'react';
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
  Stethoscope,
  Syringe,
  Cross,
  Activity,
  Pill,
  User,             
  ShieldCheck,      
  UserCog,          
  XCircle,
  AlertCircle
} from 'lucide-react';

import { FaUserMd } from 'react-icons/fa';

export default function LoginForm({ 
  role, 
  roleLabel, 
  roleColor, 
  iconElement,
  redirectPath 
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Toast Notification State
  const [toast, setToast] = useState({
    show: false,
    type: 'idle', // 'idle' | 'success' | 'error'
    message: ''
  });

  const router = useRouter();

  // Auto-dismiss toast effect
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const getRoleIcon = () => {
    switch (role) {
      case 'doctor':
        return <FaUserMd className="w-7 h-7 sm:w-8 sm:h-8 text-white" />;
      case 'admin':
        return <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />;
      case 'patient':
        return <User className="w-7 h-7 sm:w-8 sm:h-8 text-white" />;
      case 'superadmin':
        return <UserCog className="w-7 h-7 sm:w-8 sm:h-8 text-white" />;
      default:
        return <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white" />;
    }
  };

  const roleIcon = getRoleIcon();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Reset toast
    setToast({ show: false, type: 'idle', message: '' });

    try {
      // Simulate network delay for better UX visualization
      await new Promise(resolve => setTimeout(resolve, 800));

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: role === 'superadmin' ? 'superadmin' : role
        }),
      });

      const data = await response.json();

      if (data.success) {
        // SUCCESS STATE
        setToast({
          show: true,
          type: 'success',
          message: `Welcome back, ${roleLabel}! Redirecting...`
        });

        // Wait a moment to show the success toast before navigating
        setTimeout(() => {
          const userRole = data.user.role;
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
        // ERROR STATE from API
        setToast({
          show: true,
          type: 'error',
          message: data.message || 'Invalid credentials. Please try again.'
        });
      }
    } catch (err) {
      // NETWORK ERROR STATE
      setToast({
        show: true,
        type: 'error',
        message: 'Network error. Please check your connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  const colorMap = {
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    purple: 'from-purple-500 to-indigo-600',
    red: 'from-red-500 to-rose-600'
  };

  const bgColorMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/10',
    green: 'bg-green-50 dark:bg-green-900/10',
    purple: 'bg-purple-50 dark:bg-purple-900/10',
    red: 'bg-rose-50 dark:bg-rose-900/10'
  };

  // Toast styling configuration
  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/20',
          border: 'border-emerald-200 dark:border-emerald-800',
          text: 'text-emerald-800 dark:text-emerald-200',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
          bar: 'bg-emerald-500'
        };
      case 'error':
        return {
          bg: 'bg-rose-50 dark:bg-rose-900/20',
          border: 'border-rose-200 dark:border-rose-800',
          text: 'text-rose-800 dark:text-rose-200',
          icon: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
          bar: 'bg-rose-500'
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-800',
          border: 'border-slate-200 dark:border-slate-700',
          text: 'text-slate-800 dark:text-slate-200',
          icon: <AlertCircle className="w-5 h-5 text-slate-600" />,
          bar: 'bg-slate-500'
        };
    }
  };

  const toastStyles = getToastStyles(toast.type);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-hidden">
      
      {/* --- TOAST NOTIFICATION CONTAINER --- */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-sm shadow-2xl"
          >
            <div className={`relative overflow-hidden rounded-xl border ${toastStyles.border} ${toastStyles.bg} backdrop-blur-md shadow-lg`}>
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-200/20">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className={`h-full ${toastStyles.bar}`}
                />
              </div>

              <div className="p-4 flex items-center gap-3">
                {toastStyles.icon}
                <p className={`text-sm font-medium ${toastStyles.text}`}>
                  {toast.message}
                </p>
                <button 
                  onClick={() => setToast(prev => ({ ...prev, show: false }))}
                  className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 dark:from-blue-900 dark:via-cyan-900 dark:to-teal-900" />
        
        {/* Floating Bubbles */}
        {[...Array(15)].map((_, i) => {
          const size = Math.random() * 50 + 15;
          const left = Math.random() * 85 + 5;
          const top = Math.random() * 85 + 5;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-sm"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, -10, 0],
                x: [0, Math.random() * 20 - 10, 0],
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 6 + Math.random() * 8,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          );
        })}
        
        {/* Animated Medical Icons */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-14 h-14 opacity-20 dark:opacity-30"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <Heart className="w-full h-full text-white" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-12 h-12 opacity-20 dark:opacity-30"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Stethoscope className="w-full h-full text-white" />
        </motion.div>
        
        <motion.div 
          className="absolute top-1/3 right-1/3 w-10 h-10 opacity-20 dark:opacity-30"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Syringe className="w-full h-full text-white" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-1/4 left-1/3 w-12 h-12 opacity-15 dark:opacity-25"
          animate={{ rotate: [0, 180, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Cross className="w-full h-full text-white" />
        </motion.div>
        
        <motion.div 
          className="absolute top-1/5 right-1/5 w-10 h-10 opacity-15 dark:opacity-25"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Activity className="w-full h-full text-white" />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-1/5 left-1/5 w-8 h-8 opacity-15 dark:opacity-25"
          animate={{ scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          <Pill className="w-full h-full text-white" />
        </motion.div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-8 right-8 w-40 h-40 bg-blue-400/25 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-8 left-8 w-36 h-36 bg-cyan-400/25 rounded-full blur-2xl animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-teal-400/20 rounded-full blur-2xl animate-pulse animation-delay-2000 transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Depth Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-900/15 to-transparent dark:via-blue-900/25" />
        
        {/* Vignette Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_35%,_rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Decorative Wave Pattern */}
      <svg className="absolute bottom-0 left-0 right-0 h-32" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path 
          fill="url(#waveGradient)" 
          d="M0,64L48,64C96,64,192,64,288,58.7C384,53,480,43,576,42.7C672,43,768,53,864,58.7C960,64,1056,64,1152,64C1248,64,1344,64,1392,64L1440,64L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"
        >
          <animate attributeName="d" dur="15s" repeatCount="indefinite" values="
            M0,64L48,64C96,64,192,64,288,58.7C384,53,480,43,576,42.7C672,43,768,53,864,58.7C960,64,1056,64,1152,64C1248,64,1344,64,1392,64L1440,64L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z;
            M0,54L48,59C96,64,192,75,288,74.7C384,75,480,64,576,64C672,64,768,75,864,74.7C960,75,1056,64,1152,64C1248,64,1344,64,1392,64L1440,64L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z;
            M0,64L48,64C96,64,192,64,288,58.7C384,53,480,43,576,42.7C672,43,768,53,864,58.7C960,64,1056,64,1152,64C1248,64,1344,64,1392,64L1440,64L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z
          " />
        </path>
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" stopOpacity="0" className="dark:stop-opacity-0" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" stopOpacity="1" className="dark:stop-opacity-100" />
          </linearGradient>
        </defs>
      </svg>

      {/* Centered Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative w-full max-w-md mx-auto ${bgColorMap[roleColor]}`}
      >
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden relative">
          <div className={`absolute inset-0 rounded-2xl opacity-40 blur-xl ${colorMap[roleColor]}`} />
          
          <div className={`h-1.5 bg-gradient-to-r ${colorMap[roleColor]}`} />
          
          <div className="p-6 sm:p-8 relative z-10">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15 }}
                className={`inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${colorMap[roleColor]} mb-3 sm:mb-4 shadow-xl`}
              >
                {roleIcon}
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                {roleLabel} Login
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2 text-sm">
                Enter your credentials to access your dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="peer h-3.5 w-3.5 sm:h-4 sm:w-4 cursor-pointer appearance-none rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 checked:bg-blue-500 checked:border-blue-500 transition-all" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity">
                      <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">Remember me</span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium hover:underline transition-colors text-xs sm:text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 sm:py-3.5 px-4 rounded-lg sm:rounded-xl bg-gradient-to-r ${colorMap[roleColor]} text-white font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm sm:text-base`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/50">
              <Link 
                href="/" 
                className="flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                Back to role selection
              </Link>
              
              <div className="text-center mt-3 sm:mt-4">
                <span className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500">
                  Secure • Encrypted 
                </span>
              </div>
            </div>
          </div>
          
          <div className={`h-1 bg-gradient-to-r ${colorMap[roleColor]} opacity-75`} />
        </div>
      </motion.div>
    </div>
  );
}