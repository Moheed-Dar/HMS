'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Download, FileText, Calendar, User, Mail, Phone, MapPin } from 'lucide-react';

const applicationsData = [
  {
    id: 'APP-2024-001',
    applicantName: 'Dr. Emily Roberts',
    applicantAvatar: 'https://i.pravatar.cc/150?img=9',
    type: 'Doctor Registration',
    email: 'emily.roberts@email.com',
    phone: '+1 234-567-8901',
    address: '456 Medical Drive, Boston, MA 02101',
    submittedDate: '2024-01-20',
    status: 'pending',
    documents: [
      { name: 'Medical License', type: 'PDF', size: '2.1 MB' },
      { name: 'Board Certification', type: 'PDF', size: '1.8 MB' },
      { name: 'CV/Resume', type: 'PDF', size: '890 KB' },
      { name: 'ID Proof', type: 'JPG', size: '450 KB' }
    ],
    education: [
      { degree: 'MD', institution: 'Harvard Medical School', year: '2015' },
      { degree: 'Residency', institution: 'Mayo Clinic', year: '2019' }
    ],
    experience: '5 years at Boston General Hospital',
    specialty: 'Cardiology',
    notes: 'Strong background in interventional cardiology. Board certified.'
  },
];

export default function ApplicationDetailPage() {
  const params = useParams();
  const app = applicationsData.find(a => a.id === params.id) || applicationsData[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/super-admin/applications" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#7c3aed] transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Applications
      </Link>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <img src={app.applicantAvatar} alt={app.applicantName} className="w-16 h-16 rounded-2xl object-cover" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{app.applicantName}</h1>
              <p className="text-sm text-[#7c3aed]">{app.type}</p>
              <p className="text-xs text-gray-500 mt-1">Applied on {app.submittedDate}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors">
              <XCircle className="w-4 h-4" />
              Reject
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium hover:bg-green-200 transition-colors">
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{app.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{app.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{app.address}</span>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Specialty</h3>
            <p className="text-lg font-bold text-[#7c3aed]">{app.specialty}</p>
            <p className="text-sm text-gray-600 mt-2">{app.experience}</p>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-4">Education</h3>
        <div className="space-y-3 mb-6">
          {app.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">{edu.degree}</p>
                <p className="text-xs text-gray-500">{edu.institution}</p>
              </div>
              <span className="text-xs text-gray-400">{edu.year}</span>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-4">Documents ({app.documents.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {app.documents.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-[#7c3aed]" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Review Notes</h3>
          <p className="text-sm text-gray-700">{app.notes}</p>
        </div>
      </div>
    </div>
  );
}