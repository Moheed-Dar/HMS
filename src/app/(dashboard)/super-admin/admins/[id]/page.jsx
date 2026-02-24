'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Clock,
  Activity,
  Edit,
  Lock,
  Trash2,
  CheckCircle,
  XCircle,
  MoreHorizontal
} from 'lucide-react';

const adminsData = [
  {
    id: 1,
    name: 'Michael Chen',
    email: 'michael.chen@hospital.com',
    phone: '+1 234-567-8901',
    address: '456 Admin Tower, New York, NY 10001',
    role: 'Super Admin',
    department: 'IT Administration',
    status: 'active',
    joinDate: '2020-03-15',
    lastLogin: '2024-01-20 09:30 AM',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'Senior system administrator with 8+ years of experience in healthcare IT infrastructure and security management.',
    permissions: [
      'Full System Access',
      'User Management',
      'Financial Control',
      'Report Generation',
      'System Configuration'
    ],
    recentActivity: [
      { action: 'Created new doctor account', target: 'Dr. Sarah Lee', time: '2 hours ago', type: 'create' },
      { action: 'Updated system settings', target: 'Backup Configuration', time: '5 hours ago', type: 'update' },
      { action: 'Generated monthly report', target: 'Financial Report Jan 2024', time: '1 day ago', type: 'view' },
      { action: 'Deleted expired records', target: 'Old Patient Data', time: '2 days ago', type: 'delete' }
    ],
    loginHistory: [
      { device: 'Chrome on Windows', location: 'New York, USA', time: '2024-01-20 09:30 AM', status: 'success' },
      { device: 'Safari on MacBook', location: 'New York, USA', time: '2024-01-19 06:15 PM', status: 'success' },
      { device: 'Chrome on iPhone', location: 'Boston, USA', time: '2024-01-18 02:30 PM', status: 'success' },
      { device: 'Firefox on Windows', location: 'Unknown', time: '2024-01-15 11:45 PM', status: 'failed' }
    ]
  },
];

export default function AdminDetailPage() {
  const params = useParams();
  const admin = adminsData.find(a => a.id === parseInt(params.id)) || adminsData[0];

  const getActivityIcon = (type) => {
    switch(type) {
      case 'create': return <div className="p-1.5 bg-green-100 rounded-lg"><CheckCircle className="w-3 h-3 text-green-600" /></div>;
      case 'update': return <div className="p-1.5 bg-blue-100 rounded-lg"><Edit className="w-3 h-3 text-blue-600" /></div>;
      case 'delete': return <div className="p-1.5 bg-red-100 rounded-lg"><Trash2 className="w-3 h-3 text-red-600" /></div>;
      default: return <div className="p-1.5 bg-gray-100 rounded-lg"><Activity className="w-3 h-3 text-gray-600" /></div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <Link 
        href="/super-admin/admins"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#7c3aed] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admins
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          <img 
            src={admin.avatar} 
            alt={admin.name}
            className="w-32 h-32 rounded-2xl object-cover"
          />
          
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{admin.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-4 h-4 text-[#7c3aed]" />
                  <span className="text-[#7c3aed] font-medium">{admin.role}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 text-sm">{admin.department}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
                <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-4 leading-relaxed">{admin.bio}</p>

            <div className="flex flex-wrap gap-4 mt-6">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${
                admin.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {admin.status}
              </span>
              <span className="px-4 py-2 bg-purple-50 text-[#7c3aed] rounded-full text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Joined {admin.joinDate}
              </span>
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last login: {admin.lastLogin}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Mail className="w-4 h-4 text-[#7c3aed]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{admin.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">{admin.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm font-medium text-gray-900">{admin.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left">
                <Lock className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Reset Password</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Manage Permissions</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-left">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">Deactivate Account</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Permissions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Permissions & Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {admin.permissions.map((permission, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {admin.recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.target}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Login History */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Login History</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 text-[10px] font-semibold text-gray-400 uppercase">Device</th>
                    <th className="text-left py-3 text-[10px] font-semibold text-gray-400 uppercase">Location</th>
                    <th className="text-left py-3 text-[10px] font-semibold text-gray-400 uppercase">Time</th>
                    <th className="text-left py-3 text-[10px] font-semibold text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {admin.loginHistory.map((login, idx) => (
                    <tr key={idx} className="border-b border-gray-50 last:border-0">
                      <td className="py-3 text-sm text-gray-900">{login.device}</td>
                      <td className="py-3 text-xs text-gray-600">{login.location}</td>
                      <td className="py-3 text-xs text-gray-600">{login.time}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${
                          login.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {login.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}