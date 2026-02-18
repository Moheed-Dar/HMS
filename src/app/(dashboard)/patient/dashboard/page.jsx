import { cookies } from 'next/headers';
import { verifyToken } from '@/backend/lib/jwt';
import { Calendar, FileText, Clock, Activity } from 'lucide-react';

export default async function PatientDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const verification = verifyToken(token);
  const user = verification.decoded;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user.name}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here's an overview of your health journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Calendar className="w-6 h-6 text-emerald-600" />}
          title="Upcoming"
          value="2"
          label="Appointments"
          color="bg-emerald-50 dark:bg-emerald-900/20"
        />
        <StatCard 
          icon={<FileText className="w-6 h-6 text-blue-600" />}
          title="Medical"
          value="12"
          label="Records"
          color="bg-blue-50 dark:bg-blue-900/20"
        />
        <StatCard 
          icon={<Clock className="w-6 h-6 text-amber-600" />}
          title="Last Visit"
          value="15"
          label="Days ago"
          color="bg-amber-50 dark:bg-amber-900/20"
        />
        <StatCard 
          icon={<Activity className="w-6 h-6 text-rose-600" />}
          title="Health"
          value="Good"
          label="Status"
          color="bg-rose-50 dark:bg-rose-900/20"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Recent Appointments
          </h3>
          <div className="space-y-4">
            <AppointmentItem 
              doctor="Dr. Sarah Smith"
              type="General Checkup"
              date="Feb 20, 2026"
              status="Upcoming"
            />
            <AppointmentItem 
              doctor="Dr. John Doe"
              type="Dental Cleaning"
              date="Jan 15, 2026"
              status="Completed"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Health Reminders
          </h3>
          <div className="space-y-3">
            <ReminderItem text="Take blood pressure medication" time="8:00 AM" />
            <ReminderItem text="Drink 2L of water" time="All day" />
            <ReminderItem text="Evening walk" time="6:00 PM" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, label, color }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        <span className="text-sm text-slate-500">{label}</span>
      </div>
    </div>
  );
}

function AppointmentItem({ doctor, type, date, status }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{doctor}</p>
        <p className="text-sm text-slate-500">{type}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-slate-900 dark:text-white">{date}</p>
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === 'Upcoming' 
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function ReminderItem({ text, time }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
      <div className="w-2 h-2 rounded-full bg-emerald-500" />
      <div className="flex-1">
        <p className="text-sm text-slate-900 dark:text-white">{text}</p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
}