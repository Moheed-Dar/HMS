import LoginForm from '@/components/auth/LoginForm';
import { FaUserShield } from 'react-icons/fa';

export const metadata = {
  title: 'Super Admin Login - MediCare',
  description: 'Login to super admin dashboard',
};

export default function SuperAdminLogin() {
  return (
    <LoginForm
      role="superadmin"
      roleLabel="Super Admin"
      roleColor="red"
      // Fix: ab raw component function nahi, balke rendered JSX element pass kar rahe hain
      iconElement={
        <FaUserShield 
          className="w-7 h-7 sm:w-8 sm:h-8 text-white" 
        />
      }
      redirectPath="/super-admin/dashboard"
    />
  );
}