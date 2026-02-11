'use client';

import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Shield, 
  Activity,
  Globe,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const stats = [
  { label: 'Total Clinics', value: '24', change: '+3', icon: Building2, color: 'blue' },
  { label: 'System Users', value: '1,204', change: '+56', icon: Users, color: 'green' },
  { label: 'Active Admins', value: '48', change: '+2', icon: Shield, color: 'purple' },
  { label: 'System Health', value: '99.9%', icon: Activity, color: 'green' },
];

const recentClinics = [
  { name: 'City Medical Center', location: 'New York', status: 'active', users: 245 },
  { name: 'Sunrise Healthcare', location: 'California', status: 'pending', users: 0 },
  { name: 'Metro Hospital', location: 'Texas', status: 'active', users: 189 },
  { name: 'Green Valley Clinic', location: 'Florida', status: 'active', users: 134 },
];

const systemStatus = [
  { label: 'Database', status: 'operational', color: 'green' },
  { label: 'API Server', status: 'operational', color: 'green' },
  { label: 'File Storage', status: 'warning', color: 'yellow' },
  { label: 'Email Service', status: 'operational', color: 'green' },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Super Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          System-wide overview and management.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              {stat.change && (
                <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                  +{stat.change}
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Clinics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Clinic Registrations
            </h2>
            <button className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {recentClinics.map((clinic, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{clinic.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Globe size={14} /> {clinic.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    clinic.status === 'active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {clinic.status}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {clinic.users} users
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            System Status
          </h2>
          <div className="space-y-4">
            {systemStatus.map((service) => (
              <div key={service.label} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {service.label}
                </span>
                <div className="flex items-center gap-2">
                  {service.status === 'operational' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    service.status === 'operational' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">
              System Alert
            </p>
            <p className="text-xs text-red-500 dark:text-red-300">
              Storage usage at 85%. Consider upgrading soon.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}