'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const initialPatients = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 234-567-8901',
    age: 28,
    gender: 'Female',
    bloodGroup: 'O+',
    address: '123 Main St, New York',
    status: 'active',
    lastVisit: '2024-01-15',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: 'Robert Wilson',
    email: 'robert.w@email.com',
    phone: '+1 234-567-8902',
    age: 45,
    gender: 'Male',
    bloodGroup: 'A+',
    address: '456 Oak Ave, Los Angeles',
    status: 'active',
    lastVisit: '2024-01-14',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 3,
    name: 'Linda Miller',
    email: 'linda.m@email.com',
    phone: '+1 234-567-8903',
    age: 34,
    gender: 'Female',
    bloodGroup: 'B-',
    address: '789 Pine Rd, Chicago',
    status: 'inactive',
    lastVisit: '2024-01-10',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david.b@email.com',
    phone: '+1 234-567-8904',
    age: 52,
    gender: 'Male',
    bloodGroup: 'AB+',
    address: '321 Elm St, Houston',
    status: 'active',
    lastVisit: '2024-01-16',
    avatar: 'https://i.pravatar.cc/150?img=8'
  },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    bloodGroup: '',
    address: '',
    status: 'active'
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPatient) {
      setPatients(patients.map(p => p.id === editingPatient.id ? { ...formData, id: p.id, avatar: p.avatar } : p));
    } else {
      const newPatient = {
        ...formData,
        id: Date.now(),
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        lastVisit: new Date().toISOString().split('T')[0]
      };
      setPatients([...patients, newPatient]);
    }
    closeModal();
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData(patient);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this patient?')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPatient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: 'Male',
      bloodGroup: '',
      address: '',
      status: 'active'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Patients Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage all registered patients</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Patient
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm"
          />
        </div>
        <select className="px-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm border-none">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Patient</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Age/Gender</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Blood Group</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Last Visit</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={patient.avatar} 
                        alt={patient.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{patient.name}</p>
                        <p className="text-xs text-gray-500">{patient.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-xs text-gray-900">{patient.email}</p>
                    <p className="text-xs text-gray-500">{patient.phone}</p>
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-600">
                    {patient.age} years / {patient.gender}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                      {patient.bloodGroup}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                      patient.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-gray-600">{patient.lastVisit}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/super-admin/patients/${patient.id}`}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                      </Link>
                      <button 
                        onClick={() => handleEdit(patient)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                      </button>
                      <button 
                        onClick={() => handleDelete(patient.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">Showing 1 to {filteredPatients.length} of {filteredPatients.length} entries</p>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <button className="px-3 py-1.5 bg-[#7c3aed] text-white rounded-lg text-xs font-medium">1</button>
            <button className="px-3 py-1.5 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-600 transition-colors">2</button>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingPatient ? 'Edit Patient' : 'Add New Patient'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Age</label>
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    placeholder="Enter age"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  >
                    <option value="">Select Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                    <option>O+</option>
                    <option>O-</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    placeholder="Enter address"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors"
                >
                  {editingPatient ? 'Update Patient' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}