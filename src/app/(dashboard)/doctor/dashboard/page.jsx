'use client';

import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Clock, 
  FileText,
  ArrowUpRight
} from 'lucide-react';

const stats = [
  { label: 'My Patients', value: '45', icon: Users, color: 'blue' },
  { label: "Today's Appointments", value: '8', icon: Calendar, color: 'green' },
  { label: 'Pending Reports', value: '12', icon: FileText, color: 'yellow' },
  { label: 'Avg. Consultation', value: '25m', icon: Clock, color: 'purple' },
];

const upcomingAppointments = [
  { time: '09:00 AM', patient: 'John Doe', type: 'Checkup', status: 'confirmed' },
  { time: '10:30 AM', patient: 'Jane Smith', type: 'Follow-up', status: 'confirmed' },
  { time: '02:00 PM', patient: 'Mike Johnson', type: 'Consultation', status: 'pending' },
  { time: '03:30 PM', patient: 'Sarah Williams', type: 'Review', status: 'confirmed' },
];

export default function DoctorDashboard() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Doctor Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your patients and schedule efficiently.
        </p>
      </motion.div>

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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Upcoming Appointments
            </h2>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((apt, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className="text-sm font-bold text-green-600 dark:text-green-400 w-20">
                  {apt.time}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {apt.patient}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {apt.type}
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

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {['Write Prescription', 'Add Patient Notes', 'View Lab Results', 'Schedule Surgery'].map((action) => (
              <button
                key={action}
                className="w-full p-4 text-left rounded-lg bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm font-medium border border-slate-200 dark:border-slate-600"
              >
                + {action}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}