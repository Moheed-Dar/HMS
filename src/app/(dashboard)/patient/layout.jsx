import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/backend/lib/jwt';
import Link from 'next/link';

import {
    LayoutDashboard,
    Calendar,
    FileText,
    User,
    Settings,
    LogOut,
    Heart,
} from 'lucide-react';

export default async function PatientLayout({ children }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/auth/login');
    }

    let user;
    try {
        const verification = verifyToken(token);
        if (!verification.valid) {
            redirect('/auth/login');
        }
        user = verification.decoded;
    } catch (error) {
        redirect('/auth/login');
    }

    // Strict check for patient role
    if (!user || user.role !== 'patient') {
        console.log('[PATIENT LAYOUT] Access denied - role:', user?.role);
        redirect('/unauthorized');
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 bg-emerald-900 text-white fixed h-screen overflow-y-auto shadow-xl">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="p-2 bg-emerald-500 rounded-lg">
                            <Heart className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-xl font-bold">Patient Portal</h2>
                    </div>

                    <nav className="space-y-1">
                        <Link
                            href="/patient/dashboard"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors text-emerald-100"
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            href="/patient/appointments"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors text-emerald-100"
                        >
                            <Calendar size={20} />
                            <span>My Appointments</span>
                        </Link>

                        <Link
                            href="/patient/records"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors text-emerald-100"
                        >
                            <FileText size={20} />
                            <span>Medical Records</span>
                        </Link>

                        <Link
                            href="/patient/profile"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors text-emerald-100"
                        >
                            <User size={20} />
                            <span>Profile</span>
                        </Link>

                        <div className="pt-4 mt-4 border-t border-emerald-800">
                            <Link
                                href="/patient/settings"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-emerald-800 transition-colors text-emerald-100"
                            >
                                <Settings size={20} />
                                <span>Settings</span>
                            </Link>

                            <form action="/" method="POST">
                                <a
                                    href="/"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors mt-8"
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </a>
                            </form>
                        </div>
                    </nav>
                </div>

                {/* User Profile Snippet */}
                <div className="absolute bottom-0 w-full p-4 bg-emerald-950/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0) || 'P'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-emerald-300 truncate">{user.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}