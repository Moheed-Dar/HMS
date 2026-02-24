'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FadeIn from '@/components/animations/FadeIn';
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
  RotateCcw
} from 'lucide-react';

export default function PatientRegisterPage() {
  const router = useRouter();

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

  // Password strength checker
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

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Update password strength on change
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

  // ✅ RESET FORM FUNCTION
  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: ''
    });
    setFieldErrors({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: ''
    });
    setPasswordStrength({
      checks: { length: false, uppercase: false, lowercase: false, number: false, special: false },
      strength: 'weak',
      passed: 0
    });
    setShowPassword(false);
    
    // Optional: Show success toast
    setToast({
      show: true,
      type: 'success',
      message: 'Form cleared successfully!'
    });
  };

  const getPasswordRequirements = () => {
    return [
      { label: 'At least 8 characters', met: passwordStrength.checks.length },
      { label: 'One uppercase letter (A-Z)', met: passwordStrength.checks.uppercase },
      { label: 'One lowercase letter (a-z)', met: passwordStrength.checks.lowercase },
      { label: 'One number (0-9)', met: passwordStrength.checks.number },
      { label: 'One special symbol (!@#$%^&*)', met: passwordStrength.checks.special }
    ];
  };

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
        newErrors.password = 'Password must contain at least one uppercase letter (A-Z)';
        isValid = false;
      } else if (!checks.lowercase) {
        newErrors.password = 'Password must contain at least one lowercase letter (a-z)';
        isValid = false;
      } else if (!checks.number) {
        newErrors.password = 'Password must contain at least one number (0-9)';
        isValid = false;
      } else if (!checks.special) {
        newErrors.password = 'Password must contain at least one special symbol (!@#$%^&*)';
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
      } else if (msg.includes('password') || msg.includes('weak') || msg.includes('requirement')) {
        newErrors.password = 'Password does not meet security requirements';
      } else if (msg.includes('name') || msg.includes('full name')) {
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
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          bar: 'bg-emerald-500'
        };
      case 'error':
        return {
          bg: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200',
          icon: <XCircle className="w-5 h-5 text-rose-600" />,
          bar: 'bg-rose-500'
        };
      default:
        return { bg: '', icon: null, bar: '' };
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 dark:from-slate-900 dark:via-cyan-950 dark:to-teal-950 py-12 px-4 sm:px-6 lg:px-8">

      {/* ✅ FIXED TOAST - Mobile responsive positioning */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto sm:max-w-md z-[100]"
          >
            <div className={`relative overflow-hidden rounded-xl border ${toastStyles.bg} backdrop-blur-md shadow-2xl`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-200/20">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 4, ease: "linear" }}
                  className={`h-full ${toastStyles.bar}`}
                />
              </div>

              <div className="p-3 sm:p-4 flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{toastStyles.icon}</div>
                <p className="text-sm font-medium flex-1 pr-8">{toast.message}</p>
                <button
                  onClick={() => setToast(prev => ({ ...prev, show: false }))}
                  className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-black/5 transition-colors"
                  aria-label="Close notification"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-200/30 dark:bg-cyan-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/30 dark:bg-teal-800/20 rounded-full blur-3xl" />
      </div>

      <FadeIn className="w-full max-w-lg relative z-10">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
          
          {/* Header */}
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 text-center relative">
            
            {/* ✅ RESET BUTTON - Top right corner */}
            <motion.button
              type="button"
              onClick={handleReset}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              aria-label="Reset form"
              title="Clear all fields"
            >
              <RotateCcw className="w-5 h-5" />
            </motion.button>

            <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg mb-3 sm:mb-4">
              <UserPlus className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Patient Registration
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Create your account to access healthcare services
            </p>
          </div>

          {/* Form */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
              {/* Full Name */}
              <motion.div animate={fieldErrors.name ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.name ? 'text-rose-400' : 'text-slate-400'}`} />
                  <Input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className={`pl-10 w-full ${fieldErrors.name ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-900/20 focus:ring-rose-400' : ''}`} />
                  {fieldErrors.name && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />}
                </div>
                <AnimatePresence>{fieldErrors.name && (<motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors.name}</motion.p>)}</AnimatePresence>
              </motion.div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <motion.div animate={fieldErrors.email ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.email ? 'text-rose-400' : 'text-slate-400'}`} />
                    <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className={`pl-10 w-full ${fieldErrors.email ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-900/20 focus:ring-rose-400' : ''}`} />
                    {fieldErrors.email && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />}
                  </div>
                  <AnimatePresence>{fieldErrors.email && (<motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors.email}</motion.p>)}</AnimatePresence>
                </motion.div>

                {/* Phone */}
                <motion.div animate={fieldErrors.phone ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.2 }}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.phone ? 'text-rose-400' : 'text-slate-400'}`} />
                    <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+92 300 1234567" className={`pl-10 w-full ${fieldErrors.phone ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-900/20 focus:ring-rose-400' : ''}`} />
                    {fieldErrors.phone && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />}
                  </div>
                  <AnimatePresence>{fieldErrors.phone && (<motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors.phone}</motion.p>)}</AnimatePresence>
                </motion.div>
              </div>

              {/* Address */}
              <motion.div animate={fieldErrors.address ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address</label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.address ? 'text-rose-400' : 'text-slate-400'}`} />
                  <Input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="House 123, Street 5, Rawalpindi" className={`pl-10 w-full ${fieldErrors.address ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-900/20 focus:ring-rose-400' : ''}`} />
                  {fieldErrors.address && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />}
                </div>
                <AnimatePresence>{fieldErrors.address && (<motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-1 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{fieldErrors.address}</motion.p>)}</AnimatePresence>
              </motion.div>

              {/* Password with Strength Indicator */}
              <motion.div animate={fieldErrors.password ? { x: [-8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.2 }}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.password ? 'text-rose-400' : 'text-slate-400'}`} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 w-full ${fieldErrors.password ? 'border-rose-400 bg-rose-50/50 dark:bg-rose-900/20 focus:ring-rose-400' : ''}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {fieldErrors.password && <AlertCircle className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-500" />}
                </div>
                
                {/* Password Strength Bar */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div 
                          className={`h-full ${getStrengthColor(passwordStrength.strength)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength.passed / 5) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${
                        passwordStrength.strength === 'weak' ? 'text-rose-500' :
                        passwordStrength.strength === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                      </span>
                    </div>
                    
                    {/* Requirements Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-2">
                      {requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs">
                          {req.met ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span className={req.met ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <AnimatePresence>
                  {fieldErrors.password && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1 text-xs text-rose-500 dark:text-rose-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input type="checkbox" id="terms" required className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                  I agree to the <Link href="/terms" className="text-cyan-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-cyan-600 hover:underline">Privacy Policy</Link>
                </label>
              </div>

              {/* Submit & Reset Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </Button>
                
                {/* ✅ RESET BUTTON */}
                <motion.button
                  type="button"
                  onClick={handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </motion.button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link href="/login/patient" className="text-cyan-600 hover:text-cyan-700 font-medium hover:underline">
                  Sign in here
                </Link>
              </p>
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 transition-colors">
                <ArrowLeft size={16} />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}