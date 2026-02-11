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
      Icon={FaUserShield}
      redirectPath="/super-admin/dashboard"
    />
  );
}