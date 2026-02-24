'use client';

import { useState } from 'react';
import {
  Users,
  Stethoscope,
  Calendar,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  ArrowRight
} from 'lucide-react';

// Stats Card Component
const StatCard = ({ title, value, change, changeType, icon: Icon }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2.5 rounded-xl ${
        title === 'Total Patients' ? 'bg-blue-50' :
        title === 'Active Doctors' ? 'bg-purple-50' :
        title === "Today's Appts" ? 'bg-orange-50' :
        'bg-green-50'
      }`}>
        <Icon className={`w-5 h-5 ${
          title === 'Total Patients' ? 'text-blue-600' :
          title === 'Active Doctors' ? 'text-purple-600' :
          title === "Today's Appts" ? 'text-orange-500' :
          'text-green-600'
        }`} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-semibold ${
        changeType === 'positive' ? 'text-green-600' : 'text-red-500'
      }`}>
        {change}
        {changeType === 'positive' ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
      </div>
    </div>
    <h3 className="text-gray-500 text-xs font-medium mb-1">{title}</h3>
    <div className="flex items-end justify-between">
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {/* Mini Chart */}
      <svg className="w-16 h-8" viewBox="0 0 60 30">
        <path
          d={changeType === 'positive' 
            ? "M0 25 Q 15 20, 30 15 T 60 5" 
            : "M0 5 Q 15 10, 30 15 T 60 25"
          }
          fill="none"
          stroke={changeType === 'positive' ? '#7c3aed' : '#ef4444'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  </div>
);

// Department Progress
const DepartmentWorkload = ({ name, percentage }) => (
  <div className="mb-4 last:mb-0">
    <div className="flex justify-between items-center mb-1.5">
      <span className="text-sm font-medium text-gray-700">{name}</span>
      <span className="text-sm font-bold text-[#7c3aed]">{percentage}%</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div 
        className="h-full bg-[#7c3aed] rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

// Status Badge
const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: 'bg-green-100 text-green-700',
    pending: 'bg-orange-100 text-orange-700',
    discharged: 'bg-blue-100 text-blue-700',
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.pending} uppercase`}>
      {status}
    </span>
  );
};

export default function SuperAdminDashboard() {
  const [timeRange, setTimeRange] = useState('monthly');

  // Chart data
  const trendData = [
    { month: 'JAN', value: 30 },
    { month: 'FEB', value: 65 },
    { month: 'MAR', value: 45 },
    { month: 'APR', value: 25 },
    { month: 'MAY', value: 55 },
    { month: 'JUN', value: 85 },
    { month: 'JUL', value: 95 },
  ];

  const maxValue = Math.max(...trendData.map(d => d.value));
  
  // Generate SVG path
  const chartPoints = trendData.map((d, i) => {
    const x = (i / (trendData.length - 1)) * 100;
    const y = 100 - (d.value / maxValue) * 70 - 15;
    return [x, y];
  });

  const linePath = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const areaPath = `${linePath} L 100 100 L 0 100 Z`;

  const recentAdmissions = [
    { 
      id: 1, 
      patient: 'Sarah Johnson', 
      doctor: 'Dr. Michael Chen', 
      date: 'Oct 24, 2023', 
      ward: 'Cardio-B',
      status: 'confirmed',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    { 
      id: 2, 
      patient: 'Robert Wilson', 
      doctor: 'Dr. Amelia Watson', 
      date: 'Oct 24, 2023', 
      ward: 'Neurology-A',
      status: 'pending',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    { 
      id: 3, 
      patient: 'Linda Miller', 
      doctor: 'Dr. James Carter', 
      date: 'Oct 23, 2023', 
      ward: 'General-C',
      status: 'discharged',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    { 
      id: 4, 
      patient: 'David Brown', 
      doctor: 'Dr. Sophia King', 
      date: 'Oct 23, 2023', 
      ward: 'Peds-Main',
      status: 'confirmed',
      avatar: 'https://i.pravatar.cc/150?img=8'
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Patients" 
          value="12,450" 
          change="+12%" 
          changeType="positive"
          icon={Users}
        />
        <StatCard 
          title="Active Doctors" 
          value="184" 
          change="+3%" 
          changeType="positive"
          icon={Stethoscope}
        />
        <StatCard 
          title="Today's Appts" 
          value="42" 
          change="-5%" 
          changeType="negative"
          icon={Calendar}
        />
        <StatCard 
          title="Pending Apps" 
          value="12" 
          change="+8%" 
          changeType="positive"
          icon={ClipboardList}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Trends */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">Appointment Trends</h2>
              <p className="text-xs text-gray-500">Monthly visit volume for 2024</p>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1 self-start">
              <button 
                onClick={() => setTimeRange('monthly')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  timeRange === 'monthly' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setTimeRange('weekly')}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  timeRange === 'weekly' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>
          
          {/* Chart */}
          <div className="relative h-56">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              
              <path d={areaPath} fill="url(#purpleGradient)" />
              <path 
                d={linePath} 
                fill="none" 
                stroke="#7c3aed" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              
              {chartPoints.map((p, i) => (
                <circle 
                  key={i}
                  cx={p[0]} 
                  cy={p[1]} 
                  r="1.2" 
                  fill="#7c3aed"
                />
              ))}
            </svg>
            
            {/* X Axis Labels */}
            <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {trendData.map(d => (
                <span key={d.month}>{d.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Department Workload */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-6">Department Workload</h2>
          <div className="space-y-4">
            <DepartmentWorkload name="Cardiology" percentage={85} />
            <DepartmentWorkload name="Neurology" percentage={62} />
            <DepartmentWorkload name="Pediatrics" percentage={94} />
            <DepartmentWorkload name="Orthopedics" percentage={48} />
            <DepartmentWorkload name="Dermatology" percentage={35} />
          </div>
          <button className="w-full mt-6 py-2.5 px-4 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            View Detailed Performance
          </button>
        </div>
      </div>

      {/* Recent Patient Admissions */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent Patient Admissions</h2>
            <p className="text-xs text-gray-500">Real-time status tracking for current admissions</p>
          </div>
          <button className="flex items-center gap-1 text-[#7c3aed] font-medium text-xs hover:text-[#6d28d9] transition-colors self-start sm:self-auto">
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Patient</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Assigned Doctor</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date Admitted</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Ward</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentAdmissions.map((admission) => (
                <tr key={admission.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={admission.avatar} 
                        alt={admission.patient}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-semibold text-gray-900">{admission.patient}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-600">{admission.doctor}</td>
                  <td className="py-4 px-6 text-xs text-gray-600">{admission.date}</td>
                  <td className="py-4 px-6 text-xs text-gray-600">{admission.ward}</td>
                  <td className="py-4 px-6">
                    <StatusBadge status={admission.status} />
                  </td>
                  <td className="py-4 px-6">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}