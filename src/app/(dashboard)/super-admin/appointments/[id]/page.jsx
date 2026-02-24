'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Stethoscope, FileText, DollarSign, CheckCircle, Printer, Download } from 'lucide-react';

const appointmentsData = [
  {
    id: 1,
    patientName: 'Sarah Johnson',
    patientAvatar: 'https://i.pravatar.cc/150?img=1',
    patientEmail: 'sarah.j@email.com',
    patientPhone: '+1 234-567-8901',
    patientAge: 28,
    doctorName: 'Dr. Michael Chen',
    doctorAvatar: 'https://i.pravatar.cc/150?img=11',
    doctorSpecialty: 'Cardiologist',
    doctorEmail: 'dr.chen@hospital.com',
    date: '2024-01-20',
    time: '09:30 AM',
    type: 'Checkup',
    status: 'confirmed',
    notes: 'Regular heart checkup. Patient reports mild chest discomfort during exercise.',
    fee: '$150',
    duration: '30 mins',
    room: 'Cardiology-302'
  },
];

export default function AppointmentDetailPage() {
  const params = useParams();
  const apt = appointmentsData.find(a => a.id === parseInt(params.id)) || appointmentsData[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/super-admin/appointments" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#7c3aed] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Appointments
      </Link>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-gray-900">Appointment #{apt.id.toString().padStart(4, '0')}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                apt.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {apt.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">Scheduled for {apt.date} at {apt.time}</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Info */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#7c3aed]" />
              Patient Information
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <img src={apt.patientAvatar} alt={apt.patientName} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-gray-900">{apt.patientName}</p>
                <p className="text-xs text-gray-500">{apt.patientAge} years old</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">{apt.patientEmail}</p>
              <p className="text-gray-600">{apt.patientPhone}</p>
            </div>
          </div>

          {/* Doctor Info */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#7c3aed]" />
              Doctor Information
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <img src={apt.doctorAvatar} alt={apt.doctorName} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-gray-900">{apt.doctorName}</p>
                <p className="text-xs text-[#7c3aed]">{apt.doctorSpecialty}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">{apt.doctorEmail}</p>
              <p className="text-gray-600">Room {apt.room}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 bg-purple-50 rounded-xl text-center">
            <Clock className="w-5 h-5 text-[#7c3aed] mx-auto mb-2" />
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-semibold text-gray-900">{apt.duration}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl text-center">
            <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Fee</p>
            <p className="font-semibold text-gray-900">{apt.fee}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl text-center">
            <FileText className="w-5 h-5 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Type</p>
            <p className="font-semibold text-gray-900">{apt.type}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
          <p className="text-sm text-gray-600">{apt.notes}</p>
        </div>
      </div>
    </div>
  );
}