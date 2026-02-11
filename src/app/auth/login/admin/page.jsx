import LoginForm from '@/components/auth/LoginForm';
import { FaUserTie } from 'react-icons/fa';

export const metadata = {
  title: 'Admin Login - MediCare',
  description: 'Login to admin dashboard',
};

export default function AdminLogin() {
  return (
    <LoginForm 
      role="admin"
      roleLabel="Admin"
      roleColor="purple"
      Icon={FaUserTie}
      redirectPath="/admin/dashboard"
    />
  );
}