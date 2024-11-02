"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { GrGraphQl } from "react-icons/gr";
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const TopHeader: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleNavigateToLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="h-11 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 flex items-center px-4">
      <div className="flex items-center flex-1">
        <GrGraphQl className="text-blue-500 dark:text-blue-400 mr-2" />
        <h1 className="text-xl font-bold">
          <span className="text-black dark:text-white">Orchestrate</span>
          <span className="text-blue-500 dark:text-blue-400">UI</span>
        </h1>
      </div>
      <div className="flex items-center">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 
                       dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleNavigateToLogin}
            className="px-4 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 
                     rounded-md transition-colors"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default TopHeader;
