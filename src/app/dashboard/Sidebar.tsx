'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function Sidebar() {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth(); // Add user here

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) return null; // Don't render the sidebar if there's no user

  return (
    <div className="fixed left-0 top-24 bottom-0 w-[70px] bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-end pb-4">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        ⚙️
      </button>
      {showMenu && (
        <div className="absolute bottom-16 left-full ml-2 bg-white dark:bg-gray-900 rounded shadow-lg p-2">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}