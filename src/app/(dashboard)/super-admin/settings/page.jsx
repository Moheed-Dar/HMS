'use client';

import { useState } from 'react';
import { 
  Save, 
  Bell, 
  Lock, 
  User, 
  Globe, 
  Mail, 
  Shield, 
  Smartphone,
  Moon,
  Sun,
  Database,
  CreditCard,
  Users,
  FileText
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [darkMode, setDarkMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'system', label: 'System', icon: Database },
  ];

  const handleSave = () => {
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Saved successfully!');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your hospital settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-200'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">General Settings</h2>
              
              <div className="space-y-6">
                {/* Hospital Info */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#7c3aed]" />
                    Hospital Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Hospital Name</label>
                      <input 
                        type="text" 
                        defaultValue="HealthManager Hospital" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Registration Number</label>
                      <input 
                        type="text" 
                        defaultValue="REG-2024-001" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="admin@healthmanager.com" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <input 
                        type="tel" 
                        defaultValue="+1 (555) 123-4567" 
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Address</label>
                      <textarea 
                        rows={3}
                        defaultValue="123 Healthcare Avenue, Medical District, New York, NY 10001"
                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Regional Settings */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#7c3aed]" />
                    Regional Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Timezone</label>
                      <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]">
                        <option>EST (Eastern Standard Time)</option>
                        <option>CST (Central Standard Time)</option>
                        <option>MST (Mountain Standard Time)</option>
                        <option>PST (Pacific Standard Time)</option>
                        <option>GMT (Greenwich Mean Time)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Date Format</label>
                      <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Currency</label>
                      <select className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>INR (₹)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    {darkMode ? <Moon className="w-4 h-4 text-[#7c3aed]" /> : <Sun className="w-4 h-4 text-[#7c3aed]" />}
                    Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                      <p className="text-xs text-gray-500">Toggle between light and dark theme</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c3aed]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                {[
                  { id: 'email', icon: Mail, title: 'Email Notifications', desc: 'Receive updates via email', checked: true },
                  { id: 'sms', icon: Smartphone, title: 'SMS Alerts', desc: 'Get important alerts via SMS', checked: true },
                  { id: 'appointments', icon: Users, title: 'Appointment Reminders', desc: 'Notify about upcoming appointments', checked: true },
                  { id: 'reports', icon: FileText, title: 'Report Generation', desc: 'Get notified when reports are ready', checked: false },
                  { id: 'system', icon: Shield, title: 'System Alerts', desc: 'Critical system notifications', checked: true },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg">
                          <Icon className="w-4 h-4 text-[#7c3aed]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c3aed]"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                {/* Change Password */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Current Password</label>
                      <input type="password" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]" placeholder="Enter current password" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">New Password</label>
                      <input type="password" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]" placeholder="Enter new password" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                      <input type="password" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed]" placeholder="Confirm new password" />
                    </div>
                  </div>
                </div>

                {/* Two Factor Authentication */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c3aed]"></div>
                    </label>
                  </div>
                </div>

                {/* Login Sessions */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Smartphone className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Chrome on Windows</p>
                          <p className="text-xs text-gray-500">New York, USA • Current session</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <Smartphone className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Safari on iPhone</p>
                          <p className="text-xs text-gray-500">New York, USA • 2 days ago</p>
                        </div>
                      </div>
                      <button className="text-xs text-red-600 hover:text-red-700 font-medium">Revoke</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing */}
          {activeTab === 'billing' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Billing & Subscription</h2>
              
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-[#7c3aed] font-medium">Current Plan</p>
                      <h3 className="text-xl font-bold text-gray-900">Enterprise</h3>
                    </div>
                    <span className="px-3 py-1 bg-[#7c3aed] text-white rounded-lg text-xs font-semibold">Active</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">$299/month • Renews on Feb 1, 2024</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors">
                      Upgrade Plan
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Cancel Subscription
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-blue-600 rounded"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                        <p className="text-xs text-gray-500">Expires 12/25</p>
                      </div>
                    </div>
                    <button className="text-xs text-[#7c3aed] hover:text-[#6d28d9] font-medium">Change</button>
                  </div>
                </div>

                {/* Billing History */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Billing History</h3>
                  <div className="space-y-3">
                    {[
                      { date: 'Jan 1, 2024', amount: '$299.00', status: 'Paid' },
                      { date: 'Dec 1, 2023', amount: '$299.00', status: 'Paid' },
                      { date: 'Nov 1, 2023', amount: '$299.00', status: 'Paid' },
                    ].map((bill, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{bill.date}</p>
                          <p className="text-xs text-gray-500">Enterprise Plan</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">{bill.amount}</span>
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">{bill.status}</span>
                          <button className="text-xs text-[#7c3aed] hover:text-[#6d28d9] font-medium">Download</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System */}
          {activeTab === 'system' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">System Settings</h2>
              
              <div className="space-y-6">
                {/* Backup */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Data Backup</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-700">Automatic Backup</p>
                      <p className="text-xs text-gray-500">Backup data daily at 2:00 AM</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c3aed]"></div>
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors">
                      Backup Now
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Restore Backup
                    </button>
                  </div>
                </div>

                {/* Maintenance */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Maintenance Mode</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Enable Maintenance Mode</p>
                      <p className="text-xs text-gray-500">Temporarily disable access for non-admin users</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c3aed]"></div>
                    </label>
                  </div>
                </div>

                {/* Clear Cache */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Cache & Logs</h3>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-700">System Cache</p>
                      <p className="text-xs text-gray-500">Last cleared: 3 days ago</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      Clear Cache
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Error Logs</p>
                      <p className="text-xs text-gray-500">24 entries in last 30 days</p>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
            <div>
              {saveStatus && (
                <p className={`text-sm ${saveStatus.includes('success') ? 'text-green-600' : 'text-gray-600'}`}>
                  {saveStatus}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}