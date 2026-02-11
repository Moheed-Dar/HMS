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
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Welcome back! Here's an overview of your hospital.
        </p>
      </motion.div>

      {/* Stats Cards */}
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
              <div
                className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}
              >
                <stat.icon
                  className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                />
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.trend === 'up' ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}
                {stat.change}
              </div>
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

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  activity.type === 'success'
                    ? 'bg-green-500'
                    : activity.type === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                }`}
              />
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {activity.text}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}