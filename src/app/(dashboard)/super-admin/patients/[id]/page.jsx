'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Phone, Mail, MapPin, Droplet, User, FileText, Activity } from 'lucide-react';

// Mock data - same as patients page
const patientsData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 234-567-8901',
    age: 28,
    gender: 'Female',
    bloodGroup: 'O+',
    address: '123 Main St, New York, NY 10001',
    status: 'active',
    lastVisit: '2024-01-15',
    avatar: 'https://i.pravatar.cc/150?img=1',
    emergencyContact: '+1 234-567-9999',
    allergies: ['Penicillin', 'Peanuts'],
    medicalHistory: [
      { date: '2024-01-15', type: 'Checkup', doctor: 'Dr. Michael Chen', notes: 'Regular checkup, all vitals normal' },
      { date: '2023-12-10', type: 'Blood Test', doctor: 'Dr. Sarah Lee', notes: 'Cholesterol levels slightly elevated' },
    ]
  },
];

export default function PatientDetailPage() {
  const params = useParams();
  const patient = patientsData.find(p => p.id === parseInt(params.id)) || patientsData[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <Link 
        href="/super-admin/patients"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#7c3aed] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Patients
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6">
          <img 
            src={patient.avatar} 
            alt={patient.name}
            className="w-24 h-24 rounded-2xl object-cover"
          />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <p className="text-sm text-gray-500 mt-1">Patient ID: #{patient.id.toString().padStart(4, '0')}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase self-start ${
                patient.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {patient.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Age/Gender</p>
                  <p className="text-sm font-semibold text-gray-900">{patient.age} / {patient.gender}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Droplet className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Blood Group</p>
                  <p className="text-sm font-semibold text-gray-900">{patient.bloodGroup}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">{patient.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Last Visit</p>
                  <p className="text-sm font-semibold text-gray-900">{patient.lastVisit}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-900">{patient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm text-gray-900">{patient.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Emergency Contact</p>
                <p className="text-sm text-gray-900">{patient.emergencyContact}</p>
              </div>
            </div>
          </div>

          <h2 className="text-base font-bold text-gray-900 mt-6 mb-4">Allergies</h2>
          <div className="flex flex-wrap gap-2">
            {patient.allergies.map((allergy, index) => (
              <span key={index} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium">
                {allergy}
              </span>
            ))}
          </div>
        </div>

        {/* Medical History */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Medical History</h2>
          <div className="space-y-4">
            {patient.medicalHistory.map((record, index) => (
              <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg h-fit">
                  <FileText className="w-4 h-4 text-[#7c3aed]" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{record.type}</h3>
                    <span className="text-xs text-gray-500">{record.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Dr. {record.doctor}</p>
                  <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2.5 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Activity className="w-4 h-4" />
            View Full Medical History
          </button>
        </div>
      </div>
    </div>
  );
}