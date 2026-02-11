// src/app/(auth)/login/doctor/page.tsx
// NO "use client" here — this is now a Server Component

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
      iconElement={<FaUserMd className="w-7 h-7 sm:w-8 sm:h-8 text-white" />}
      redirectPath="/doctor/dashboard"
    />
  );
}