'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Printer, Download, Pill, Calendar, User, Stethoscope, AlertCircle } from 'lucide-react';

const prescriptionsData = [
  {
    id: 'RX-2024-001',
    patientName: 'Sarah Johnson',
    patientAvatar: 'https://i.pravatar.cc/150?img=1',
    patientAge: 28,
    patientGender: 'Female',
    doctorName: 'Dr. Michael Chen',
    doctorAvatar: 'https://i.pravatar.cc/150?img=11',
    doctorSpecialty: 'Cardiologist',
    date: '2024-01-20',
    diagnosis: 'Hypertension (High Blood Pressure)',
    status: 'active',
    notes: 'Take medication with food. Monitor blood pressure daily.',
    medications: [
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning with food' },
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take at bedtime' },
      { name: 'Hydrochlorothiazide', dosage: '12.5mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning' }
    ]
  },
];

export default function PrescriptionDetailPage() {
  const params = useParams();
  const rx = prescriptionsData.find(r => r.id === params.id) || prescriptionsData[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/super-admin/prescriptions" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#7c3aed] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Prescriptions
      </Link>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Pill className="w-6 h-6 text-[#7c3aed]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{rx.id}</h1>
              <p className="text-sm text-gray-500">Issued on {rx.date}</p>
            </div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#7c3aed]" />
              Patient Information
            </h3>
            <div className="flex items-center gap-3">
              <img src={rx.patientAvatar} alt={rx.patientName} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-gray-900">{rx.patientName}</p>
                <p className="text-xs text-gray-500">{rx.patientAge} years, {rx.patientGender}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#7c3aed]" />
              Prescribing Doctor
            </h3>
            <div className="flex items-center gap-3">
              <img src={rx.doctorAvatar} alt={rx.doctorName} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-gray-900">{rx.doctorName}</p>
                <p className="text-xs text-[#7c3aed]">{rx.doctorSpecialty}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-red-50 rounded-xl mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            Diagnosis
          </h3>
          <p className="text-sm text-gray-700">{rx.diagnosis}</p>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-4">Prescribed Medications</h3>
        <div className="space-y-4">
          {rx.medications.map((med, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{med.name}</h4>
                <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">
                  {med.dosage}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Frequency</p>
                  <p className="font-medium text-gray-900">{med.frequency}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">{med.duration}</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">{med.instructions}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Doctor's Notes</h3>
          <p className="text-sm text-gray-700">{rx.notes}</p>
        </div>
      </div>
    </div>
  );
}