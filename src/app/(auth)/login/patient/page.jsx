// src/app/(auth)/login/patient/page.jsx

'use client';

import LoginForm from '@/components/auth/LoginForm';
import { FaUser } from 'react-icons/fa';   // ← add this


export default function PatientLogin() {
  return (
    <LoginForm
      role="patient"
      roleLabel="Patient"
      roleColor="blue"          // ← better to match your theme (was green)
      iconElement={
        <FaUser className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
      }
      redirectPath="/patient/dashboard"
    />
  );
}