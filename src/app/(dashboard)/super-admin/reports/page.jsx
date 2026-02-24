'use client';

import { useState } from 'react';
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, X, Download, FileText, Calendar, User, Filter } from 'lucide-react';
import Link from 'next/link';

const initialReports = [
  {
    id: 1,
    title: 'Monthly Patient Statistics',
    type: 'Analytics',
    generatedBy: 'Dr. Michael Chen',
    date: '2024-01-15',
    status: 'completed',
    format: 'PDF',
    size: '2.4 MB',
    description: 'Comprehensive analysis of patient admissions, discharges, and bed occupancy'
  },
  {
    id: 2,
    title: 'Revenue Report Q4 2023',
    type: 'Financial',
    generatedBy: 'Sarah Williams',
    date: '2024-01-10',
    status: 'completed',
    format: 'Excel',
    size: '1.8 MB',
    description: 'Quarterly revenue breakdown by department and service type'
  },
  {
    id: 3,
    title: 'Staff Performance Review',
    type: 'HR',
    generatedBy: 'James Anderson',
    date: '2024-01-08',
    status: 'pending',
    format: 'PDF',
    size: '3.2 MB',
    description: 'Annual performance evaluation for medical and administrative staff'
  },
  {
    id: 4,
    title: 'Equipment Maintenance Log',
    type: 'Operations',
    generatedBy: 'Mike Johnson',
    date: '2024-01-05',
    status: 'completed',
    format: 'PDF',
    size: '890 KB',
    description: 'Maintenance schedule and repair history for all medical equipment'
  },
];

const reportTypes = ['Analytics', 'Financial', 'HR', 'Operations', 'Medical', 'Inventory'];

export default function ReportsPage() {
  const [reports, setReports] = useState(initialReports);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Analytics',
    description: '',
    format: 'PDF'
  });

  const filteredReports = reports.filter(r =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingReport) {
      setReports(reports.map(r => r.id === editingReport.id ? { ...formData, id: r.id, generatedBy: r.generatedBy, date: r.date, status: r.status, size: r.size } : r));
    } else {
      const newReport = {
        ...formData,
        id: Date.now(),
        generatedBy: 'Current User',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        size: '0 KB'
      };
      setReports([...reports, newReport]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (confirm('Delete this report?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReport(null);
    setFormData({ title: '', type: 'Analytics', description: '', format: 'PDF' });
  };

  const getTypeColor = (type) => {
    const colors = {
      'Analytics': 'bg-blue-100 text-blue-700',
      'Financial': 'bg-green-100 text-green-700',
      'HR': 'bg-purple-100 text-purple-700',
      'Operations': 'bg-orange-100 text-orange-700',
      'Medical': 'bg-red-100 text-red-700',
      'Inventory': 'bg-gray-100 text-gray-700'
    };
    return colors[type] || colors['Analytics'];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports</h1>
          <p className="text-xs text-gray-500 mt-1">Generate and manage system reports</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors shadow-lg shadow-purple-200 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm"
          />
        </div>
        <select className="px-4 py-2.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm border-none">
          <option>All Types</option>
          {reportTypes.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-xl">
                <FileText className="w-6 h-6 text-[#7c3aed]" />
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-gray-400" />
                </button>
                <button onClick={() => handleDelete(report.id)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-900 mb-1">{report.title}</h3>
            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{report.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${getTypeColor(report.type)}`}>
                {report.type}
              </span>
              <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-semibold">
                {report.format}
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {report.generatedBy}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {report.date}
                </span>
              </div>
              <span>{report.size}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Generate New Report</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Report Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  >
                    {reportTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Format</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({...formData, format: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                  >
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>CSV</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]"
                />
              </div>
              
              <div className="flex items-center justify-end gap-3 pt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2.5 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors">
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}