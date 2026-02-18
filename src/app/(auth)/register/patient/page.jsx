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
  MapPin
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
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'idle', message: '' });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setToast({ show: true, type: 'error', message: 'Full name is required' });
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setToast({ show: true, type: 'error', message: 'Please enter a valid email' });
      return false;
    }
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!formData.phone.trim() || cleanPhone.length < 10 || cleanPhone.length > 15) {
      setToast({ show: true, type: 'error', message: 'Please enter a valid phone number (10-15 digits)' });
      return false;
    }
    if (!formData.address.trim()) {
      setToast({ show: true, type: 'error', message: 'Address is required' });
      return false;
    }
    if (formData.password.length < 6) {
      setToast({ show: true, type: 'error', message: 'Password must be at least 6 characters' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setToast({ show: false, type: 'idle', message: '' });

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
          // avatar: "..."   // ← add later if needed (optional in API)
        }),
      });

      const data = await response.json();

      if (data.success) {
        setToast({
          show: true,
          type: 'success',
          message: `Welcome ${data.user.name}! Registration successful. Redirecting...`
        });

        setTimeout(() => {
          router.push('/login/patient');
        }, 1800);
      } else {
        setToast({
          show: true,
          type: 'error',
          message: data.message || 'Registration failed. Please try again.'
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

  const toastStyles = getToastStyles(toast.type);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 dark:from-slate-900 dark:via-cyan-950 dark:to-teal-950 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md"
          >
            <div className={`relative overflow-hidden rounded-xl border ${toastStyles.bg} backdrop-blur-md shadow-lg`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-200/20">
                <motion.div initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 4, ease: "linear" }} className={`h-full ${toastStyles.bar}`} />
              </div>
              <div className="p-4 flex items-center gap-3">
                {toastStyles.icon}
                <p className="text-sm font-medium">{toast.message}</p>
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
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Patient Registration
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Create your account to access healthcare services
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House 123, Street 5, Rawalpindi"
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 pr-10 w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="terms"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400">
                  I agree to the <Link href="/terms" className="text-cyan-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-cyan-600 hover:underline">Privacy Policy</Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
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