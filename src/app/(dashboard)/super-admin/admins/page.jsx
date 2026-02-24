'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, X, Shield, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

const initialAdmins = [
  {
    id: 1,
    name: 'Michael Chen',
    email: 'michael.chen@hospital.com',
    phone: '+1 234-567-8901',
    role: 'Super Admin',
    department: 'IT Administration',
    status: 'active',
    lastLogin: '2024-01-16 09:30 AM',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: 2,
    name: 'Sarah Williams',
    email: 'sarah.w@hospital.com',
    phone: '+1 234-567-8902',
    role: 'Admin',
    department: 'Human Resources',
    status: 'active',
    lastLogin: '2024-01-16 08:15 AM',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    id: 3,
    name: 'James Anderson',
    email: 'james.a@hospital.com',
    phone: '+1 234-567-8903',
    role: 'Admin',
    department: 'Operations',
    status: 'inactive',
    lastLogin: '2024-01-15 05:45 PM',
    avatar: 'https://i.pravatar.cc/150?img=13'
  },
];

const roles = ['Super Admin', 'Admin', 'Manager', 'Staff'];

export default function AdminsPage() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Admin',
    department: '',
    status: 'active',
    password: ''
  });

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAdmin) {
      setAdmins(admins.map(a => a.id === editingAdmin.id ? { ...formData, id: a.id, avatar: a.avatar, lastLogin: a.lastLogin } : a));
    } else {
      const newAdmin = {
        ...formData,
        id: Date.now(),
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        lastLogin: 'Never'
      };
      setAdmins([...admins, newAdmin]);
    }
    closeModal();
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormData({ ...admin, password: '' });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter(a => a.id !== id));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAdmin(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Admin',
      department: '',
      status: 'active',
      password: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admins Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage system administrators and staff</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Admin
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search admins by name, email, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm"
          />
        </div>
        <select className="px-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm border-none">
          <option>All Roles</option>
          <option>Super Admin</option>
          <option>Admin</option>
          <option>Manager</option>
        </select>
      </div>

      {/* Admins Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAdmins.map((admin) => (
          <div key={admin.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={admin.avatar} 
                  alt={admin.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{admin.name}</h3>
                  <p className="text-xs text-gray-500">{admin.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => handleEdit(admin)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-gray-400" />
                </button>
                <button 
                  onClick={() => handleDelete(admin.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Shield className="w-3.5 h-3.5 text-[#7c3aed]" />
                <span className="font-medium text-[#7c3aed]">{admin.role}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{admin.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{admin.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${
                admin.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {admin.status}
              </span>
              <span className="text-[10px] text-gray-400">Last login: {admin.lastLogin}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  />
                </div>
                <div className="col-span-2">
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
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  >
                    {roles.map(role => <option key={role}>{role}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  />
                </div>
                {!editingAdmin && (
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
                    <input
                      type="password"
                      required={!editingAdmin}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                    />
                  </div>
                )}
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
                  {editingAdmin ? 'Update Admin' : 'Add Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}