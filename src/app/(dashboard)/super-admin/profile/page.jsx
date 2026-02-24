'use client';

import { Camera, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Dr. Julianne Smith',
    email: 'admin@clinichealth.com',
    phone: '+1 234-567-8900',
    address: '123 Admin Street, New York, NY 10001',
    role: 'Super Admin',
    department: 'IT Administration',
    joinDate: '2020-03-15',
    bio: 'Experienced healthcare administrator with over 10 years of experience in hospital management and IT systems.'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img 
              src="https://i.pravatar.cc/150?img=5" 
              alt={profile.name}
              className="w-24 h-24 rounded-2xl object-cover"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-[#7c3aed] text-white rounded-lg shadow-lg">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-[#7c3aed] font-medium">{profile.role}</p>
            <p className="text-sm text-gray-500 mt-1">{profile.department}</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors"
          >
            {isEditing ? <><X className="w-4 h-4" /> Cancel</> : <><Edit className="w-4 h-4" /> Edit Profile</>}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Name</label>
            <input 
              type="text" 
              value={profile.name}
              disabled={!isEditing}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
              <Mail className="w-4 h-4 text-gray-400" />
              <input 
                type="email" 
                value={profile.email}
                disabled={!isEditing}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="flex-1 bg-transparent text-sm focus:outline-none disabled:bg-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Phone</label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
              <Phone className="w-4 h-4 text-gray-400" />
              <input 
                type="tel" 
                value={profile.phone}
                disabled={!isEditing}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className="flex-1 bg-transparent text-sm focus:outline-none disabled:bg-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Join Date</label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={profile.joinDate}
                disabled
                className="flex-1 bg-transparent text-sm"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Address</label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl">
              <MapPin className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                value={profile.address}
                disabled={!isEditing}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                className="flex-1 bg-transparent text-sm focus:outline-none disabled:bg-transparent"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea 
              rows={4}
              value={profile.bio}
              disabled={!isEditing}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] disabled:bg-gray-100 resize-none"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-6">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}