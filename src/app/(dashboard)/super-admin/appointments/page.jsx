'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, X, Calendar, Clock, User, Stethoscope, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const initialAppointments = [
  {
    id: 1,
    patientName: 'Sarah Johnson',
    patientAvatar: 'https://i.pravatar.cc/150?img=1',
    doctorName: 'Dr. Michael Chen',
    doctorAvatar: 'https://i.pravatar.cc/150?img=11',
    date: '2024-01-20',
    time: '09:30 AM',
    type: 'Checkup',
    status: 'confirmed',
    notes: 'Regular heart checkup',
    fee: '$150'
  },
  {
    id: 2,
    patientName: 'Robert Wilson',
    patientAvatar: 'https://i.pravatar.cc/150?img=3',
    doctorName: 'Dr. Amelia Watson',
    doctorAvatar: 'https://i.pravatar.cc/150?img=5',
    date: '2024-01-20',
    time: '10:00 AM',
    type: 'Follow-up',
    status: 'pending',
    notes: 'Neurology follow-up',
    fee: '$200'
  },
  {
    id: 3,
    patientName: 'Linda Miller',
    patientAvatar: 'https://i.pravatar.cc/150?img=5',
    doctorName: 'Dr. James Carter',
    doctorAvatar: 'https://i.pravatar.cc/150?img=12',
    date: '2024-01-19',
    time: '02:00 PM',
    type: 'Consultation',
    status: 'completed',
    notes: 'Pediatric consultation',
    fee: '$120'
  },
  {
    id: 4,
    patientName: 'David Brown',
    patientAvatar: 'https://i.pravatar.cc/150?img=8',
    doctorName: 'Dr. Sophia King',
    doctorAvatar: 'https://i.pravatar.cc/150?img=9',
    date: '2024-01-21',
    time: '11:30 AM',
    type: 'Emergency',
    status: 'cancelled',
    notes: 'Severe headache',
    fee: '$180'
  },
];

const appointmentTypes = ['Checkup', 'Follow-up', 'Consultation', 'Emergency', 'Surgery'];
const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
    type: 'Checkup',
    status: 'pending',
    notes: '',
    fee: ''
  });

  const filteredAppointments = appointments.filter(apt =>
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAppointment) {
      setAppointments(appointments.map(a => a.id === editingAppointment.id ? { ...formData, id: a.id, patientAvatar: a.patientAvatar, doctorAvatar: a.doctorAvatar } : a));
    } else {
      const newAppointment = {
        ...formData,
        id: Date.now(),
        patientAvatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        doctorAvatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
      };
      setAppointments([...appointments, newAppointment]);
    }
    closeModal();
  };

  const handleEdit = (apt) => {
    setEditingAppointment(apt);
    setFormData(apt);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAppointment(null);
    setFormData({
      patientName: '',
      doctorName: '',
      date: '',
      time: '',
      type: 'Checkup',
      status: 'pending',
      notes: '',
      fee: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Appointments</h1>
          <p className="text-xs text-gray-500 mt-1">Manage patient appointments and schedules</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Appointment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: appointments.length, color: 'bg-purple-100 text-purple-700' },
          { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, color: 'bg-green-100 text-green-700' },
          { label: 'Pending', value: appointments.filter(a => a.status === 'pending').length, color: 'bg-orange-100 text-orange-700' },
          { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, color: 'bg-blue-100 text-blue-700' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-lg font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm"
          />
        </div>
        <input type="date" className="px-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm border-none" />
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Patient</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Doctor</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Fee</th>
                <th className="text-left py-4 px-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={apt.patientAvatar} alt={apt.patientName} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-sm font-semibold text-gray-900">{apt.patientName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={apt.doctorAvatar} alt={apt.doctorName} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-xs text-gray-600">{apt.doctorName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-gray-900">{apt.date}</span>
                      <span className="text-xs text-gray-500">{apt.time}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                      {apt.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(apt.status)}
                      <select 
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                        className="text-xs font-medium capitalize bg-transparent border-none focus:ring-0 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm font-semibold text-gray-900">{apt.fee}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Link href={`/super-admin/appointments/${apt.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </Link>
                      <button onClick={() => handleEdit(apt)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-blue-500" />
                      </button>
                      <button onClick={() => handleDelete(apt.id)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingAppointment ? 'Edit Appointment' : 'New Appointment'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Doctor Name</label>
                  <input
                    type="text"
                    required
                    value={formData.doctorName}
                    onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Time</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  >
                    {appointmentTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Fee</label>
                  <input
                    type="text"
                    required
                    value={formData.fee}
                    onChange={(e) => setFormData({...formData, fee: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    placeholder="$150"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2.5 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors">
                  {editingAppointment ? 'Update' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}