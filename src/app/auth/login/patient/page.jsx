import LoginForm from '@/components/auth/LoginForm';
import { FaUser } from 'react-icons/fa';

export const metadata = {
  title: 'Patient Login - MediCare',
  description: 'Login to patient portal',
};

export default function PatientLogin() {
  return (
    <LoginForm 
      role="patient"
      roleLabel="Patient"
      roleColor="blue"
      Icon={FaUser}
      redirectPath="/patient/dashboard"
    />
  );
}