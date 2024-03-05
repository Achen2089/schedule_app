import React, { useState } from 'react';
import { useRouter } from 'next/router';
import prisma from '../lib/prisma';

const Home: React.FC = () => {
  const router = useRouter();
  const [role, setRole] = useState<string>('');

  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
    // Redirect based on role selection
    if (selectedRole === 'coach') {
      router.push('/coach');
    } else if (selectedRole === 'student') {
      router.push('/student');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Welcome to Stepful</h1>
      <p>Select your role to continue:</p>
      <div>
        <button onClick={() => handleRoleSelection('coach')} style={{ marginRight: '10px', padding: '10px 20px', cursor: 'pointer' }}>
          Coach
        </button>
        <button onClick={() => handleRoleSelection('student')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Student
        </button>
      </div>
    </div>
  );
};

export default Home;