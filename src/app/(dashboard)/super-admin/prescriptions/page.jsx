'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, X, Pill, FileText, Calendar, User, Stethoscope } from 'lucide-react';
import Link from 'next/link';

const initialPrescriptions = [
  {
    id: 'RX-2024-001',
    patientName: 'Sarah Johnson',
    patientAvatar: 'https://i.pravatar.cc/150?img=1',
    doctorName: 'Dr. Michael Chen',
    doctorAvatar: 'https://i.pravatar.cc/150?img=11',
    date: '2024-01-20',
    diagnosis: 'Hypertension',
    medications: 3,
    status: 'active',
    notes: 'Take medication with food'
  },
  {
    id: 'RX-2024-002',
    patientName: 'Robert Wilson',
    patientAvatar: 'https://i.pravatar.cc/150?img=3',
    doctorName: 'Dr. Amelia Watson',
    doctorAvatar: 'https://i.pravatar.cc/150?img=5',
    date: '2024-01-19',
    diagnosis: 'Migraine',
    medications: 2,
    status: 'completed',
    notes: 'Avoid bright lights'
  },
  {
    id: 'RX-2024-003',
    patientName: 'Linda Miller',
    patientAvatar: 'https://i.pravatar.cc/150?img=5',
    doctorName: 'Dr. James Carter',
    doctorAvatar: 'https://i.pravatar.cc/150?img=12',
    date: '2024-01-18',
    diagnosis: 'Common Cold',
    medications: 4,
    status: 'active',
    notes: 'Rest and hydration'
  },
];

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredPrescriptions = prescriptions.filter(p =>
    p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (confirm('Delete this prescription?')) {
      setPrescriptions(prescriptions.filter(p => p.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-xs text-gray-500 mt-1">Manage patient prescriptions and medications</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Prescription
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search prescriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Prescription ID</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Patient</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Doctor</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Diagnosis</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPrescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-[#7c3aed]" />
                      <span className="text-sm font-mono font-medium text-gray-900">{rx.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={rx.patientAvatar} alt={rx.patientName} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-sm font-semibold text-gray-900">{rx.patientName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={rx.doctorAvatar} alt={rx.doctorName} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-xs text-gray-600">{rx.doctorName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">{rx.diagnosis}</span>
                    <p className="text-xs text-gray-500">{rx.medications} medications</p>
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-600">{rx.date}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                      rx.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rx.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Link href={`/super-admin/prescriptions/${rx.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </Link>
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <FileText className="w-4 h-4 text-blue-500" />
                      </button>
                      <button onClick={() => handleDelete(rx.id)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
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