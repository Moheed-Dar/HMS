import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/backend/lib/jwt';

import {
  LayoutDashboard,
  Users,
  User,
  Calendar,
  Settings,
  LogOut,
  Stethoscope,
} from 'lucide-react';

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  // Agar token nahi hai → login pe bhejo
  if (!token) {
    redirect('/auth/login');
  }

  let user;
  try {
    // verifyToken ko sahi se call kar rahe hain (tumhare jwt.js ke hisaab se)
    const verification = verifyToken(token);
    if (!verification.valid) {
      console.log('Token invalid:', verification.error);
      redirect('/auth/login');
    }
    user = verification.decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    redirect('/auth/login');
  }

  // Debugging ke liye log (terminal mein check karo)
  console.log('[ADMIN LAYOUT] User role from token:', user?.role);

  // Temporary fix: role check ko loose kar do
  // Agar tum "superadmin", "billing_admin", "admin" sab allow karna chahte ho
  const allowedRoles = ['doctor'];
  
  if (!user || !allowedRoles.includes(user.role)) {
    console.log('[ADMIN LAYOUT] Access denied - role:', user?.role);
    redirect('/unauthorized');
  }

  // Agar yahan tak aaya matlab role sahi hai → dashboard dikhaye
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-screen overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>

          <nav className="space-y-2">
            <a
              href="/doctor/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </a>

           
            <a
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors mt-8"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </a>
          </nav>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 bg-slate-50 dark:bg-slate-950">
        {children}
      </main>
    </div>
  );
}