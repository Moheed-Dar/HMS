'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Lock, 
  ArrowLeft, 
  Home, 
  Mail,
  Fingerprint
} from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 p-4">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-lg w-full"
      >
        <div className="bg-white/10 dark:bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          
          {/* Top Gradient Bar */}
          <div className="h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-500" />
          
          <div className="p-8 md:p-10 text-center">
            
            {/* Animated Icon Container */}
            <motion.div 
              className="relative mx-auto w-28 h-28 mb-8"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            >
              {/* Outer Ring */}
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-red-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Middle Ring */}
              <motion.div 
                className="absolute inset-2 rounded-full border-4 border-dashed border-orange-500/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner Circle with Icon */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/30">
                <ShieldAlert className="w-12 h-12 text-white" strokeWidth={1.5} />
              </div>
              
              {/* Lock Icon Badge */}
              <motion.div 
                className="absolute -bottom-1 -right-1 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border-2 border-white/20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Lock className="w-5 h-5 text-red-400" />
              </motion.div>
            </motion.div>

            {/* Status Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4">
                Error 403
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Access Denied
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-base md:text-lg text-slate-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              You don&apos;t have permission to access this page. 
              <span className="block mt-2 text-sm text-slate-400">
                This area is restricted to authorized personnel only.
              </span>
            </motion.p>

            {/* Security Features List */}
            <motion.div 
              className="flex flex-wrap justify-center gap-3 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {['Secure Area', 'Authentication Required', 'Restricted Access'].map((item, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-400"
                >
                  <Fingerprint className="w-3 h-3" />
                  {item}
                </span>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link
                href="/"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Back to Home
              </Link>
            </motion.div>

            {/* Contact Support */}
            <motion.div 
              className="mt-8 pt-6 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-sm text-slate-400 mb-3">Need help or think this is a mistake?</p>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors hover:underline"
              >
                <Mail className="w-4 h-4" />
                Contact Support Team
              </Link>
            </motion.div>
          </div>
          
          {/* Bottom Decorative Element */}
          <div className="h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        </div>
        
        {/* Floating Particles */}
        <motion.div
          className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full blur-sm"
          animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-500 rounded-full blur-sm"
          animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </motion.div>
    </div>
  );
}