'use client';

import { motion } from 'framer-motion';
import { 
  Calendar, 
  FileText, 
  Pill, 
  User,
  Clock,
  ChevronRight
} from 'lucide-react';

const upcomingAppointments = [
  { 
    doctor: 'Dr. Sarah Johnson', 
    specialty: 'Cardiology',
    date: 'Tomorrow',
    time: '10:00 AM',
    status: 'confirmed'
  },
  { 
    doctor: 'Dr. Michael Chen', 
    specialty: 'General Medicine',
    date: 'Dec 15, 2024',
    time: '02:30 PM',
    status: 'pending'
  },
];

const quickStats = [
  { label: 'Total Visits', value: '12', icon: Calendar, color: 'blue' },
  { label: 'Prescriptions', value: '5', icon: Pill, color: 'green' },
  { label: 'Lab Reports', value: '8', icon: FileText, color: 'purple' },
];

export default function PatientDashboard() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          My Health Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome back! Here's your health overview.
        </p>
      </motion.div>

      {/* Next Appointment Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-8 text-white shadow-lg"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Next Appointment</p>
            <h2 className="text-3xl font-bold mb-2">Tomorrow, 10:00 AM</h2>
            <p className="text-lg mb-1">Dr. Sarah Johnson</p>
            <p className="text-blue-100">Cardiology Department</p>
          </div>
          <div className="p-4 bg-white/20 rounded-xl">
            <Calendar className="w-8 h-8" />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors">
            Reschedule
          </button>
          <button className="px-4 py-2 bg-blue-400/30 text-white rounded-lg font-medium text-sm hover:bg-blue-400/40 transition-colors">
            Cancel
          </button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 w-fit mb-4`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Appointments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Upcoming Appointments
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="space-y-4">
          {upcomingAppointments.map((apt, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white">{apt.doctor}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{apt.specialty}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {apt.date} at {apt.time}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                apt.status === 'confirmed' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {apt.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}