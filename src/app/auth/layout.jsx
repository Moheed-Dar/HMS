export const metadata = {
  title: 'Authentication - MediCare',
  description: 'Login or register to access MediCare',
};

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {children}
    </div>
  );
}