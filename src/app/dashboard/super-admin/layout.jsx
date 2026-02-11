import Link from 'next/link';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Shield, 
  Settings, 
  LogOut
} from 'lucide-react';
import { verifyToken } from '@/backend/lib/jwt';

export default async function SuperAdminLayout({ children }) {
  const token = cookies().get('token')?.value;
  const { valid, decoded } = verifyToken(token);
  
  if (!valid || decoded.role !== 'superadmin') {
    redirect('/login/super-admin');
  }

  const menuItems = [
    { href: '/super-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/super-admin/clinics', label: 'Clinics', icon: Building2 },
    { href: '/super-admin/admins', label: 'Admins', icon: Shield },
    { href: '/super-admin/users', label: 'All Users', icon: Users },
    { href: '/super-admin/settings', label: 'Settings', icon: Settings },
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
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="mb-4 px-4">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{decoded.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Super Admin</p>
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