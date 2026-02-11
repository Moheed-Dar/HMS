import LoginForm from '@/components/auth/LoginForm';
import { FaUserMd } from 'react-icons/fa';

export const metadata = {
  title: 'Doctor Login - MediCare',
  description: 'Login to doctor dashboard',
};

export default function DoctorLogin() {
  return (
    <LoginForm 
      role="doctor"
      roleLabel="Doctor"
      roleColor="green"
      Icon={FaUserMd}
      redirectPath="/doctor/dashboard"
    />
  );
}