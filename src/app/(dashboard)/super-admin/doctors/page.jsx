'use client';

import {useState} from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, X, Stethoscope, Star, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';

const initialDoctors = [
  {
    id: 1,
    name: 'Dr. Michael Chen',
    specialty: 'Cardiologist',
    email: 'dr.chen@hospital.com',
    phone: '+1 234-567-8901',
    experience: '15 years',
    rating: 4.9,
    patients: 1240,
    fee: '$150',
    status: 'active',
    schedule: 'Mon-Fri, 9AM-5PM',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'Senior Cardiologist with expertise in interventional cardiology'
  },
  {
    id: 2,
    name: 'Dr. Amelia Watson',
    specialty: 'Neurologist',
    email: 'dr.watson@hospital.com',
    phone: '+1 234-567-8902',
    experience: '12 years',
    rating: 4.8,
    patients: 890,
    fee: '$200',
    status: 'active',
    schedule: 'Mon-Wed, 10AM-6PM',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Specialized in neurological disorders and brain surgery'
  },
  {
    id: 3,
    name: 'Dr. James Carter',
    specialty: 'Pediatrician',
    email: 'dr.carter@hospital.com',
    phone: '+1 234-567-8903',
    experience: '8 years',
    rating: 4.7,
    patients: 2100,
    fee: '$120',
    status: 'on-leave',
    schedule: 'Tue-Thu, 9AM-4PM',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Child specialist with focus on developmental pediatrics'
  },
];

const specialties = ['Cardiologist', 'Neurologist', 'Pediatrician', 'Orthopedic', 'Dermatologist', 'General Physician'];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: 'General Physician',
    experience: '',
    fee: '',
    schedule: '',
    bio: '',
    status: 'active'
  });

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDoctor) {
      setDoctors(doctors.map(d => d.id === editingDoctor.id ? { ...formData, id: d.id, avatar: d.avatar, rating: d.rating, patients: d.patients } : d));
    } else {
      const newDoctor = {
        ...formData,
        id: Date.now(),
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        rating: 0,
        patients: 0
      };
      setDoctors([...doctors, newDoctor]);
    }
    closeModal();
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData(doctor);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: 'General Physician',
      experience: '',
      fee: '',
      schedule: '',
      bio: '',
      status: 'active'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Doctors Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage hospital doctors and specialists</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Doctor
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors by name, specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm"
          />
        </div>
        <select className="px-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm border-none">
          <option>All Specialties</option>
          {specialties.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={doctor.avatar} 
                  alt={doctor.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{doctor.name}</h3>
                  <p className="text-xs text-[#7c3aed] font-medium">{doctor.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleEdit(doctor)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-gray-400" />
                </button>
                <button 
                  onClick={() => handleDelete(doctor.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3 line-clamp-2">{doctor.bio}</p>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Star className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-xs font-semibold text-gray-900">{doctor.rating}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Stethoscope className="w-3.5 h-3.5 text-[#7c3aed]" />
                <span className="text-xs font-semibold text-gray-900">{doctor.patients}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <DollarSign className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-semibold text-gray-900">{doctor.fee}</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-semibold text-gray-900">{doctor.experience}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                doctor.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : doctor.status === 'on-leave'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {doctor.status}
              </span>
              <span className="text-[10px] text-gray-400">{doctor.schedule}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
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
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Specialty</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  >
                    {specialties.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Experience</label>
                  <input
                    type="text"
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    placeholder="e.g. 10 years"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Consultation Fee</label>
                  <input
                    type="text"
                    required
                    value={formData.fee}
                    onChange={(e) => setFormData({...formData, fee: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    placeholder="e.g. $150"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Schedule</label>
                  <input
                    type="text"
                    required
                    value={formData.schedule}
                    onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    placeholder="e.g. Mon-Fri, 9AM-5PM"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Bio</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
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
                    <option value="on-leave">On Leave</option>
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
                  {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}