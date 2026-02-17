'use client';

import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  TrendingUp,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Patients',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'blue',
  },
  {
    label: 'Total Doctors',
    value: '56',
    change: '+5%',
    trend: 'up',
    icon: Activity,
    color: 'green',
  },
  {
    label: 'Appointments Today',
    value: '48',
    change: '-3%',
    trend: 'down',
    icon: Calendar,
    color: 'purple',
  },
  {
    label: 'Revenue',
    value: '$12,345',
    change: '+8%',
    trend: 'up',
    icon: DollarSign,
    color: 'yellow',
  },
];

const recentActivity = [
  { id: 1, text: 'New patient registered', time: '2 min ago', type: 'success' },
  { id: 2, text: 'Dr. Smith updated schedule', time: '5 min ago', type: 'info' },
  { id: 3, text: 'Appointment cancelled', time: '12 min ago', type: 'warning' },
  { id: 4, text: 'Payment received', time: '1 hour ago', type: 'success' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header - Responsive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Welcome back! Here's an overview of your hospital.
        </p>
      </motion.div>

      {/* Stats Cards - Fully Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
              <div
                className={`p-2.5 sm:p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex-shrink-0`}
              >
                <stat.icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                />
              </div>
              <div
                className={`flex items-center gap-1 text-xs sm:text-sm ${
                  stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {stat.trend === 'up' ? (
                  <ArrowUpRight size={14} className="sm:w-4 sm:h-4" />
                ) : (
                  <ArrowDownRight size={14} className="sm:w-4 sm:h-4" />
                )}
                <span className="font-medium">{stat.change}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              {stat.label}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity - Responsive */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-slate-900 dark:text-white">
          Recent Activity
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {recentActivity.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * activity.id }}
              className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors duration-200"
            >
              <div
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 flex-shrink-0 ${
                  activity.type === 'success'
                    ? 'bg-green-500'
                    : activity.type === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white truncate">
                  {activity.text}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {activity.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}