import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { 
  LayoutDashboard, 
  Users, 
  UserMd, 
  Calendar, 
  Settings, 
  LogOut
} from 'lucide-react';
import { verifyToken } from '@/backend/lib/jwt';

export default async function AdminLayout({ children }) {
  // Get token from cookies
  const token = cookies().get('token')?.value;
  
  // Verify token using your existing function
  const { valid, decoded, error } = verifyToken(token);
  
  // If no token or invalid, redirect to login
  if (!valid) {
    redirect('/login/admin');
  }
  
  // Check if user has admin role
  const allowedRoles = ['admin', 'superadmin'];
  if (!allowedRoles.includes(decoded.role)) {
    redirect('/login/admin');
  }

  const menuItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/doctors', label: 'Doctors', icon: UserMd },
    { href: '/admin/patients', label: 'Patients', icon: Users },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-40 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo2.png" alt="MediCare" className="h-8 w-auto" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">MediCare</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="mb-4 px-4">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{decoded.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{decoded.role}</p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}