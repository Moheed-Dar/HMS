'use client';


import LoginForm from '@/components/auth/LoginForm';

export default function PatientLoginPage() {
  return (
    <LoginForm
      role="patient"
      roleLabel="Patient"
      roleColor="green" // Using green theme for patients 
      redirectPath="/patient/dashboard"
    />
  );
}