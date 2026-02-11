'use client';

import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaUserMd, 
  FaUserTie, 
  FaUserShield 
} from 'react-icons/fa';
import Link from 'next/link';

const roles = [
  {
    id: 'patient',
    label: 'Patient',
    description: 'Book appointments & view medical records',
    icon: FaUser,
    color: 'blue',
    href: '/login/patient'
  },
  {
    id: 'doctor',
    label: 'Doctor',
    description: 'Manage patients & schedules',
    icon: FaUserMd,
    color: 'green',
    href: '/login/doctor'
  },
  {
    id: 'admin',
    label: 'Admin',
    description: 'Manage clinic operations',
    icon: FaUserTie,
    color: 'purple',
    href: '/login/admin'
  },
  {
    id: 'superadmin',
    label: 'Super Admin',
    description: 'System administration',
    icon: FaUserShield,
    color: 'red',
    href: '/login/super-admin'
  }
];

export default function LoginSelection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
            <FaUserShield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Select your role to continue
          </p>
        </div>

        <div className="space-y-3">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={role.href}>
                <div className="group flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 dark:border-slate-700 hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 hover:shadow-lg bg-slate-50 dark:bg-slate-700/30">
                  <div className={`p-3 rounded-lg bg-${role.color}-100 dark:bg-${role.color}-900/30`}>
                    <role.icon className={`w-6 h-6 text-${role.color}-600 dark:text-${role.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {role.label}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {role.description}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            New patient?{' '}
            <Link href="/register/patient" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 font-medium">
              Create account
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-cyan-600 dark:text-slate-400 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );
}