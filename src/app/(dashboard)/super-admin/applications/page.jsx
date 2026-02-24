'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, X, FileText, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

const initialApplications = [
  {
    id: 'APP-2024-001',
    applicantName: 'Dr. Emily Roberts',
    applicantAvatar: 'https://i.pravatar.cc/150?img=9',
    type: 'Doctor Registration',
    email: 'emily.roberts@email.com',
    phone: '+1 234-567-8901',
    submittedDate: '2024-01-20',
    status: 'pending',
    documents: 4,
    notes: 'New cardiologist application'
  },
  {
    id: 'APP-2024-002',
    applicantName: 'Metro Labs',
    applicantAvatar: 'https://i.pravatar.cc/150?img=60',
    type: 'Lab Partnership',
    email: 'partners@metrolabs.com',
    phone: '+1 234-567-8902',
    submittedDate: '2024-01-19',
    status: 'approved',
    documents: 6,
    notes: 'Diagnostic lab partnership request'
  },
  {
    id: 'APP-2024-003',
    applicantName: 'John Davis',
    applicantAvatar: 'https://i.pravatar.cc/150?img=13',
    type: 'Patient Registration',
    email: 'john.davis@email.com',
    phone: '+1 234-567-8903',
    submittedDate: '2024-01-18',
    status: 'rejected',
    documents: 2,
    notes: 'Incomplete documentation'
  },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState(initialApplications);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplications = applications.filter(app =>
    app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (id, newStatus) => {
    setApplications(applications.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Applications</h1>
          <p className="text-xs text-gray-500 mt-1">Review and manage incoming applications</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm"
          />
        </div>
        <select className="px-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm border-none">
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Application ID</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Applicant</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Submitted</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#7c3aed]" />
                      <span className="text-sm font-mono font-medium text-gray-900">{app.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={app.applicantAvatar} alt={app.applicantName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{app.applicantName}</p>
                        <p className="text-xs text-gray-500">{app.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                      {app.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-600">{app.submittedDate}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <select 
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="text-xs font-medium capitalize bg-transparent border-none focus:ring-0 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Link href={`/super-admin/applications/${app.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </Link>
                    </div>
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