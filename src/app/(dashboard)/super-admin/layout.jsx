'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Stethoscope,
  Calendar,
  BarChart3,
  FileText,
  ClipboardList,
  FolderOpen,
  Settings,
  User,
  Bell,
  Search,
  Plus,
  Menu,
  X,
  LogOut,
} from 'lucide-react';

const sidebarLinks = [
  { name: 'Dashboard', href: '/super-admin/dashboard', icon: LayoutDashboard },
  { name: 'Patients', href: '/super-admin/patients', icon: Users },
  { name: 'Admins', href: '/super-admin/admins', icon: UserCog },
  { name: 'Doctors', href: '/super-admin/doctors', icon: Stethoscope },
  { name: 'Appointments', href: '/super-admin/appointments', icon: Calendar },
  { name: 'Reports', href: '/super-admin/reports', icon: BarChart3 },
  { name: 'Prescriptions', href: '/super-admin/prescriptions', icon: FileText },
  { name: 'Applications', href: '/super-admin/applications', icon: ClipboardList },
  { name: 'Medical Records', href: '/super-admin/medical-records', icon: FolderOpen },
];

const accountLinks = [
  { name: 'Settings', href: '/super-admin/settings', icon: Settings },
  { name: 'Profile', href: '/super-admin/profile', icon: User },
];

export default function SuperAdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  // Logout function
  const handleLogout = () => {
    // Clear any auth tokens/local storage data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Or if using cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Redirect to home page
    router.push('/');
    
    // Optional: Show logout success message
    // toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-[#f8f7fc] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#7c3aed] rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">HealthManager</h1>
              <p className="text-xs text-[#7c3aed] font-medium uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 pb-4 flex flex-col h-[calc(100vh-100px)] overflow-y-auto">
          <nav className="space-y-1 flex-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${active 
                      ? 'bg-[#7c3aed] text-white shadow-lg shadow-purple-200' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Account Section */}
          <div className="mt-6">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Account</p>
            <nav className="space-y-1">
              {accountLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${active 
                        ? 'bg-[#7c3aed] text-white' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 px-2 py-3">
              <img 
                src="https://i.pravatar.cc/150?img=5" 
                alt="Dr. Julianne Smith"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Dr. Julianne Smith</p>
                <p className="text-xs text-gray-500 truncate">admin@clinichealth.com</p>
              </div>
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#f8f7fc] px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients, doctors, records..."
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7c3aed] shadow-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl bg-white hover:bg-gray-50 transition-colors shadow-sm">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button 
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}