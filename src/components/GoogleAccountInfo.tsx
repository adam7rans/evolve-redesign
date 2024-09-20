import React from 'react';
import Image from 'next/image';

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

interface GoogleAccountInfoProps {
  user: GoogleUser;
}

const GoogleAccountInfo: React.FC<GoogleAccountInfoProps> = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <Image
          src={user.picture}
          alt={user.name}
          width={50}
          height={50}
          className="rounded-full mr-4"
          onError={(e) => {
            e.currentTarget.src = '/default-avatar.png' // Replace with a path to a default avatar image
          }}
        />
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Your Google account has been successfully connected.
      </p>
    </div>
  );
};

export default GoogleAccountInfo;