'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign, 
  Users,
  Award,
  Briefcase,
  FileText,
  Edit,
  MessageSquare,
  Video,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const doctorsData = [
  {
    id: 1,
    name: 'Dr. Michael Chen',
    specialty: 'Cardiologist',
    email: 'dr.chen@hospital.com',
    phone: '+1 234-567-8901',
    address: '123 Medical Center Dr, New York, NY 10001',
    experience: '15 years',
    rating: 4.9,
    reviews: 128,
    patients: 1240,
    fee: '$150',
    status: 'active',
    schedule: 'Mon-Fri, 9AM-5PM',
    avatar: 'https://i.pravatar.cc/150?img=11',
    bio: 'Dr. Michael Chen is a board-certified cardiologist with over 15 years of experience in interventional cardiology. He specializes in complex coronary interventions and structural heart diseases.',
    education: [
      { degree: 'MD', institution: 'Harvard Medical School', year: '2005' },
      { degree: 'Residency in Internal Medicine', institution: 'Massachusetts General Hospital', year: '2008' },
      { degree: 'Fellowship in Cardiology', institution: 'Cleveland Clinic', year: '2011' },
      { degree: 'Interventional Cardiology Fellowship', institution: 'Mount Sinai Hospital', year: '2013' }
    ],
    certifications: [
      'American Board of Internal Medicine',
      'American Board of Cardiology',
      'Fellow of American College of Cardiology',
      'Society for Cardiovascular Angiography and Interventions'
    ],
    awards: [
      'Top Doctor Award 2023',
      'Patient Choice Award 2022',
      'Research Excellence Award 2021'
    ],
    languages: ['English', 'Mandarin', 'Spanish'],
    services: [
      'Coronary Angioplasty',
      'Cardiac Catheterization',
      'Echocardiography',
      'Stress Testing',
      'Heart Failure Management'
    ],
    recentAppointments: [
      { patient: 'Sarah Johnson', date: '2024-01-20', time: '09:30 AM', type: 'Follow-up', status: 'completed' },
      { patient: 'Robert Wilson', date: '2024-01-20', time: '10:30 AM', type: 'Consultation', status: 'completed' },
      { patient: 'Emily Davis', date: '2024-01-21', time: '02:00 PM', type: 'Checkup', status: 'scheduled' }
    ]
  },
  {
    id: 2,
    name: 'Dr. Amelia Watson',
    specialty: 'Neurologist',
    email: 'dr.watson@hospital.com',
    phone: '+1 234-567-8902',
    address: '456 Neuroscience Center, Boston, MA 02101',
    experience: '12 years',
    rating: 4.8,
    reviews: 96,
    patients: 890,
    fee: '$200',
    status: 'active',
    schedule: 'Mon-Wed, 10AM-6PM',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Dr. Amelia Watson is a renowned neurologist specializing in neurological disorders and brain surgery. She has extensive experience in treating complex neurological conditions.',
    education: [
      { degree: 'MD', institution: 'Johns Hopkins School of Medicine', year: '2008' },
      { degree: 'Residency in Neurology', institution: 'Mayo Clinic', year: '2012' },
      { degree: 'Fellowship in Neurosurgery', institution: 'UCSF Medical Center', year: '2015' }
    ],
    certifications: [
      'American Board of Psychiatry and Neurology',
      'American Academy of Neurology',
      'Congress of Neurological Surgeons'
    ],
    awards: [
      'Neurologist of the Year 2022',
      'Excellence in Patient Care 2021'
    ],
    languages: ['English', 'French'],
    services: [
      'Brain Surgery',
      'Epilepsy Treatment',
      'Stroke Management',
      'Neurological Consultation',
      'EMG Testing'
    ],
    recentAppointments: [
      { patient: 'Robert Wilson', date: '2024-01-19', time: '11:00 AM', type: 'Follow-up', status: 'completed' },
      { patient: 'Lisa Anderson', date: '2024-01-22', time: '03:00 PM', type: 'Consultation', status: 'scheduled' }
    ]
  },
  {
    id: 3,
    name: 'Dr. James Carter',
    specialty: 'Pediatrician',
    email: 'dr.carter@hospital.com',
    phone: '+1 234-567-8903',
    address: '789 Children Hospital Ave, Chicago, IL 60601',
    experience: '8 years',
    rating: 4.7,
    reviews: 156,
    patients: 2100,
    fee: '$120',
    status: 'on-leave',
    schedule: 'Tue-Thu, 9AM-4PM',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Dr. James Carter is a compassionate pediatrician dedicated to providing comprehensive care for children from birth through adolescence.',
    education: [
      { degree: 'MD', institution: 'Stanford University School of Medicine', year: '2012' },
      { degree: 'Residency in Pediatrics', institution: 'Children Hospital Los Angeles', year: '2015' },
      { degree: 'Fellowship in Pediatric Cardiology', institution: 'Boston Children Hospital', year: '2017' }
    ],
    certifications: [
      'American Board of Pediatrics',
      'American Academy of Pediatrics'
    ],
    awards: [
      'Best Pediatrician Award 2023',
      'Parent Choice Award 2022'
    ],
    languages: ['English', 'Spanish'],
    services: [
      'Well-Child Visits',
      'Vaccinations',
      'Developmental Screening',
      'Pediatric Emergency Care',
      'Adolescent Medicine'
    ],
    recentAppointments: [
      { patient: 'Linda Miller', date: '2024-01-18', time: '10:00 AM', type: 'Vaccination', status: 'completed' },
      { patient: 'Tommy Brown', date: '2024-01-23', time: '11:30 AM', type: 'Checkup', status: 'scheduled' }
    ]
  }
];

export default function DoctorDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAllEducation, setShowAllEducation] = useState(false);
  
  const doctorId = parseInt(params.id);
  const doctor = doctorsData.find(d => d.id === doctorId) || doctorsData[0];

  const displayedEducation = showAllEducation 
    ? doctor.education 
    : doctor.education.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
      <Link 
        href="/super-admin/doctors"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#7c3aed] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Doctors
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex flex-col items-center lg:items-start">
            <img 
              src={doctor.avatar} 
              alt={doctor.name}
              className="w-32 h-32 rounded-2xl object-cover"
            />
            <div className="flex gap-2 mt-4">
              <button className="p-2 bg-[#7c3aed] text-white rounded-xl hover:bg-[#6d28d9] transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                <Video className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                <p className="text-[#7c3aed] font-medium">{doctor.specialty}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase self-center lg:self-auto ${
                doctor.status === 'active' 
                  ? 'bg-green-100 text-green-700' 
                  : doctor.status === 'on-leave'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {doctor.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-4 leading-relaxed">{doctor.bio}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-purple-50 rounded-xl text-center">
                <Star className="w-5 h-5 text-[#7c3aed] mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{doctor.rating}</p>
                <p className="text-xs text-gray-500">{doctor.reviews} reviews</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <Users className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{doctor.patients}</p>
                <p className="text-xs text-gray-500">Patients</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <Briefcase className="w-5 h-5 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{doctor.experience}</p>
                <p className="text-xs text-gray-500">Experience</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl text-center">
                <DollarSign className="w-5 h-5 text-orange-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-gray-900">{doctor.fee}</p>
                <p className="text-xs text-gray-500">Per visit</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="border-b border-gray-100">
          <div className="flex gap-1 p-2">
            {['overview', 'appointments', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-[#7c3aed] text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <Mail className="w-4 h-4 text-[#7c3aed]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">{doctor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{doctor.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-sm font-medium text-gray-900">{doctor.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Schedule</p>
                        <p className="text-sm font-medium text-gray-900">{doctor.schedule}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((lang, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Awards */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#7c3aed]" />
                    Awards & Recognition
                  </h3>
                  <div className="space-y-3">
                    {doctor.awards.map((award, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                        <Award className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm text-gray-700">{award}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle & Right Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Education */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Education & Training</h3>
                  <div className="space-y-4">
                    {displayedEducation.map((edu, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-[#7c3aed] rounded-full"></div>
                          {idx !== displayedEducation.length - 1 && <div className="w-0.5 h-full bg-gray-200 my-1"></div>}
                        </div>
                        <div className="pb-4">
                          <p className="font-semibold text-gray-900">{edu.degree}</p>
                          <p className="text-sm text-gray-600">{edu.institution}</p>
                          <p className="text-xs text-gray-400">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {doctor.education.length > 3 && (
                    <button 
                      onClick={() => setShowAllEducation(!showAllEducation)}
                      className="flex items-center gap-2 text-sm text-[#7c3aed] hover:text-[#6d28d9] mt-2"
                    >
                      {showAllEducation ? (
                        <>Show Less <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>Show More <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Certifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {doctor.certifications.map((cert, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.services.map((service, idx) => (
                      <span key={idx} className="px-4 py-2 bg-purple-50 text-[#7c3aed] rounded-xl text-sm font-medium">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Appointments</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-[10px] font-semibold text-gray-400 uppercase">Patient</th>
                      <th className="text-left py-3 text-[10px] font-semibold text-gray-400 uppercase">Date</th>
                      <th className="text-left py-3 text-[10px] font-semibold text-gray-400 uppercase">Time</th>
                      <th className="text-left py-3 text-[10px] font-semibold text-gray-400 uppercase">Type</th>
                      <th className="text-left py-3 text-[10px] font-semibold text-gray-400 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctor.recentAppointments.map((apt, idx) => (
                      <tr key={idx} className="border-b border-gray-50 last:border-0">
                        <td className="py-3 text-sm text-gray-900">{apt.patient}</td>
                        <td className="py-3 text-xs text-gray-600">{apt.date}</td>
                        <td className="py-3 text-xs text-gray-600">{apt.time}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                            {apt.type}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${
                            apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Reviews Coming Soon</h3>
              <p className="text-sm text-gray-500">Patient reviews will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}