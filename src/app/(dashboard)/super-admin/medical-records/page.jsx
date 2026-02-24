'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, X, FolderOpen, Calendar, User, Stethoscope, FileText } from 'lucide-react';
import Link from 'next/link';

const initialRecords = [
  {
    id: 'MR-2024-001',
    patientName: 'Sarah Johnson',
    patientAvatar: 'https://i.pravatar.cc/150?img=1',
    doctorName: 'Dr. Michael Chen',
    date: '2024-01-20',
    type: 'Consultation',
    diagnosis: 'Hypertension',
    files: 3,
    status: 'complete'
  },
  {
    id: 'MR-2024-002',
    patientName: 'Robert Wilson',
    patientAvatar: 'https://i.pravatar.cc/150?img=3',
    doctorName: 'Dr. Amelia Watson',
    date: '2024-01-19',
    type: 'Lab Results',
    diagnosis: 'Blood Test',
    files: 5,
    status: 'complete'
  },
  {
    id: 'MR-2024-003',
    patientName: 'Linda Miller',
    patientAvatar: 'https://i.pravatar.cc/150?img=5',
    doctorName: 'Dr. James Carter',
    date: '2024-01-18',
    type: 'X-Ray',
    diagnosis: 'Chest Examination',
    files: 2,
    status: 'pending'
  },
];

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState(initialRecords);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records.filter(r =>
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-xs text-gray-500 mt-1">Manage patient medical history and documents</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-200 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search medical records..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <FolderOpen className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                record.status === 'complete' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {record.status}
              </span>
            </div>

            <p className="text-xs text-gray-400 font-mono mb-2">{record.id}</p>
            <h3 className="text-sm font-bold text-gray-900 mb-1">{record.diagnosis}</h3>
            <p className="text-xs text-gray-500 mb-4">{record.type}</p>

            <div className="flex items-center gap-3 mb-4">
              <img src={record.patientAvatar} alt={record.patientName} className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-xs font-medium text-gray-900">{record.patientName}</p>
                <p className="text-[10px] text-gray-500">{record.doctorName}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FileText className="w-3.5 h-3.5" />
                {record.files} files
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/super-admin/medical-records/${record.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Eye className="w-4 h-4 text-gray-400" />
                </Link>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}